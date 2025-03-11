import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * parseInt(limit, 10);

      const reports = await prisma.dailydutyreport.findMany({
        skip,
        take: parseInt(limit, 10),
        include: { usersec: true },
        orderBy: { date: 'desc' },
      });

      const totalCount = await prisma.dailydutyreport.count();
      const nextPage = skip + parseInt(limit, 10) < totalCount;

      const supervisorIds = reports.map((report) => report.supervisor);
      const supervisors = await prisma.user.findMany({
        where: { id: { in: supervisorIds } },
        select: { id: true, name: true },
      });

      const supervisorMap = supervisors.reduce(
        (acc, supervisor) => ({ ...acc, [supervisor.id]: supervisor.name }),
        {}
      );

      const serializedReports = reports.map((report) => ({
        ...report,
        date: report.date.toISOString().split('T')[0],
        supervisorName: supervisorMap[report.supervisor] || 'Unknown',
        usersec: Array.isArray(report.usersec)
          ? report.usersec.map((user) => ({
              ...user,
              timeIn: user.timeIn.toISOString().slice(11, 16),
              timeOut: user.timeOut.toISOString().slice(11, 16),
            }))
          : [],
      }));

      return res.status(200).json({ data: serializedReports, nextPage });
    }

    if (req.method === 'POST') {
      const { date, shift, supervisor, usersec, createdById } = req.body;
      console.log(req.body)
      if (!date || !shift || !supervisor || !Array.isArray(usersec)) {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
      }

      try {
        const userSecurityData = usersec.map((user) => {
          const timeIn = new Date(user.timeIn);
          const timeOut = new Date(user.timeOut);

          if (
            !user.name ||
            !user.designation ||
            isNaN(timeIn.getTime()) ||
            isNaN(timeOut.getTime()) ||
            !user.location ||
            !user.userId
          ) {
            throw new Error(`Invalid usersec entry for user: ${user.name || 'Unknown'}`);
          }

          return {
            name: user.name,
            designation: user.designation,
            location: user.location,
            timeIn,
            timeOut,
            userId: user.userId,
          };
        });
        console.log(userSecurityData)
        const newReport = await prisma.dailydutyreport.create({
          data: {
            date: new Date(date),
            shift,
            supervisor: parseInt(supervisor),
            usersec: {
              create: userSecurityData,
            },
          },
          include: {
            usersec: true,
          },
        });

        const supervisorUser = await prisma.user.findUnique({
          where: { id: newReport.supervisor },
          select: { name: true },
        });

        const managers = await prisma.user.findMany({
          where: {
            role: {
              name: 'Manager',
            },
          },
          select: { id: true, name: true },
        });

        const creator = await prisma.user.findUnique({
          where: { id: parseInt(createdById, 10) },
          select: { name: true },
        });

        if (!creator) {
          throw new Error('Invalid createdById');
        }

        const notificationPromises = managers.map((manager) =>
          prisma.notification.create({
            data: {
              templateId: 2,
              userId: manager.id,
              createdById: parseInt(createdById, 10),
              altText: `A new daily duty report for shift ${shift} has been created by ${creator.name}.`,
              link: `/security-services/daily-duty-security/view/${newReport.id}`,
              isRead: false,
              sentAt: new Date(),
            },
          })
        );

        await Promise.all(notificationPromises);

        const serializedNewReport = {
          ...newReport,
          date: newReport.date.toISOString().split('T')[0],
          supervisorName: supervisorUser?.name || 'Unknown',
          usersec: newReport.usersec.map((user) => ({
            ...user,
            timeIn: user.timeIn.toISOString().slice(11, 16),
            timeOut: user.timeOut.toISOString().slice(11, 16),
          })),
        };

        return res.status(201).json(serializedNewReport);
      } catch (error) {
        console.error('Validation or database error:', error.message);
        return res.status(400).json({ error: error.message });
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Missing record ID' });
      }

      try {
        const existingRecord = await prisma.dailydutyreport.findUnique({
          where: { id: parseInt(id, 10) },
        });

        if (!existingRecord) {
          return res.status(404).json({ error: 'Record not found' });
        }

        await prisma.dailydutyreport.delete({
          where: { id: parseInt(id, 10) },
        });

        return res.status(200).json({ message: 'Record deleted successfully' });
      } catch (error) {
        console.error('Error deleting record:', error.message);
        return res.status(500).json({ error: 'Failed to delete the record' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
