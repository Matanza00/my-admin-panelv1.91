import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const cctvReports = await prisma.cCTVReport.findMany({
        include: {
          camera: true,
        },
      });

      // Replace cctvOperator ID with name
      const reportsWithNames = await Promise.all(cctvReports.map(async (report) => {
        const operator = await prisma.user.findUnique({
          where: {
            id: report.cctvOperator,
          },
        });

        return {
          ...report,
          cctvOperator: operator ? operator.name : 'Unknown Operator',
        };
      }));

      return res.status(200).json(reportsWithNames);
    } catch (error) {
      console.error('Error fetching CCTV reports:', error);
      return res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
