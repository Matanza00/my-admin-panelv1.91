import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Fetch the specific record by ID
      const report = await prisma.dailydutyreport.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          usersec: true, // Include related usersec records
        },
      });

      if (!report) {
        return res.status(404).json({ error: 'Daily Duty Security record not found' });
      }

      // Fetch supervisor's name
      const supervisorUser = await prisma.user.findUnique({
        where: { id: parseInt(report.supervisor) },
        select: { name: true },
      });

      // Serialize the data for JSON response
      const serializedReport = {
        ...report,
        date: report.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        supervisorName: supervisorUser?.name || 'Unknown', // Include supervisor name
        usersec: report.usersec.map((user) => ({
          ...user,
          timeIn: user.timeIn.toISOString().slice(11, 16), // Format as HH:MM
          timeOut: user.timeOut.toISOString().slice(11, 16),
        })),
      };

      return res.status(200).json(serializedReport);
    }

    if (req.method === 'PUT') {
      const { date, shift, supervisor, usersec } = req.body;

      // Validate input
      if (!date || !shift || !supervisor || !Array.isArray(usersec)) {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
      }

      let validUsersec = [];
      try {
        validUsersec = usersec.map((user) => {
          const timeIn = new Date(user.timeIn); // Already combined with date in frontend
          const timeOut = new Date(user.timeOut);

          if (
            !user.name ||
            !user.designation ||
            isNaN(timeIn.getTime()) || // Ensure timeIn is a valid date
            isNaN(timeOut.getTime()) || // Ensure timeOut is a valid date
            !user.location 
          ) {
            console.error('Invalid usersec entry detected:', user);
            throw new Error(`Invalid usersec entry for user: ${user.name || 'Unknown'}`);
          }

          return {
            name: user.name,
            designation: user.designation,
            timeIn,
            timeOut,
            location: user.location,
          };
        });
      } catch (error) {
        console.error('Validation error:', error.message);
        return res.status(400).json({ error: error.message });
      }

      // Update the report
      const updatedReport = await prisma.dailydutyreport.update({
        where: { id: parseInt(id, 10) },
        data: {
          date: new Date(date),
          shift,
          supervisor: parseInt(supervisor), // Ensure the supervisor is stored as an ID
          usersec: {
            deleteMany: {}, // Clear existing usersec entries
            create: validUsersec, // Add valid entries
          },
        },
        include: {
          usersec: true,
        },
      });

      // Fetch supervisor's name for response
      const supervisorUser = await prisma.user.findUnique({
        where: { id: parseInt(updatedReport.supervisor) },
        select: { name: true },
      });

      // Serialize the updated report
      const serializedUpdatedReport = {
        ...updatedReport,
        date: updatedReport.date.toISOString().split('T')[0],
        supervisorName: supervisorUser?.name || 'Unknown', // Include supervisor name
        usersec: updatedReport.usersec.map((user) => ({
          ...user,
          timeIn: user.timeIn.toISOString().slice(11, 16), // Format as HH:MM
          timeOut: user.timeOut.toISOString().slice(11, 16),
        })),
      };

      return res.status(200).json(serializedUpdatedReport);
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
