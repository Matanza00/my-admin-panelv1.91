import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({ error: 'Both "from" and "to" dates are required.' });
      }

      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format.' });
      }

      // Fetch FCUReports based on date range
      const reports = await prisma.fCUReport.findMany({
        where: {
          date: {
            gte: fromDate,
            lte: toDate,
          },
        },
        include: {
          floorFCs: true,
        },
      });

      // Fetch user details for attendedBy and verifiedBy
      const userIds = new Set();
      reports.forEach(report => {
        report.floorFCs.forEach(floorFC => {
          userIds.add(parseInt(floorFC.attendedBy));
          userIds.add(parseInt(floorFC.verifiedBy));
        });
      });

      // Query the users based on the gathered IDs
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: Array.from(userIds),
          },
        },
      });

      // Create a mapping for easy access to user names by ID
      const userMapping = users.reduce((acc, user) => {
        acc[user.id] = user.name;  // Assuming user table has 'name' field
        return acc;
      }, {});

      // Replace IDs with user names in the reports
      const updatedReports = reports.map(report => {
        const updatedFloorFCs = report.floorFCs.map(floorFC => ({
          ...floorFC,
          attendedBy: userMapping[floorFC.attendedBy] || floorFC.attendedBy,
          verifiedBy: userMapping[floorFC.verifiedBy] || floorFC.verifiedBy,
        }));

        return {
          ...report,
          floorFCs: updatedFloorFCs,
        };
      });

      // Return the modified reports with user names
      res.status(200).json(updatedReports);
    } catch (error) {
      console.error('Error fetching FCUReports:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
