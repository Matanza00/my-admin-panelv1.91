import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all daily duty reports along with usersec data
      const dailyDutyReports = await prisma.dailydutyreport.findMany({
        include: {
          usersec: true,
        },
      });

      // Replace supervisor ID with name
      const reportsWithSupervisorName = await Promise.all(
        dailyDutyReports.map(async (report) => {
          // Fetch supervisor name using the supervisor ID
          const supervisor = await prisma.user.findUnique({
            where: { id: report.supervisor },
            select: { name: true },
          });

          return {
            ...report,
            supervisor: supervisor ? supervisor.name : null, // Replace ID with name
          };
        })
      );

      return res.status(200).json(reportsWithSupervisorName);
    } catch (error) {
      console.error('Error fetching daily duty reports:', error);
      return res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
