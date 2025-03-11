import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const totalReports = await prisma.janitorialReport.count();
    const totalSupervisors = await prisma.user.count({
      where: { role: 'Supervisor' },
    });
    const totalTenants = await prisma.tenants.count();

    // Fetch the 5 most recent reports
    const recentReports = await prisma.janitorialReport.findMany({
      take: 5,
      orderBy: { date: 'desc' },
    });

    // Manually fetch supervisor and tenant names based on their IDs
    const formattedReports = await Promise.all(
      recentReports.map(async (report) => {
        const supervisor = await prisma.user.findUnique({
          where: { id: parseInt(report.supervisor, 10) },
          select: { name: true },
        });

        const tenant = await prisma.tenants.findUnique({
          where: { id: parseInt(report.tenant, 10) },
          select: { tenantName: true },
        });

        return {
          id: report.id,
          date: report.date,
          supervisorName: supervisor?.name || 'Unknown',
          tenantName: tenant?.tenantName || 'Unknown',
          remarks: report.remarks,
        };
      })
    );

    res.status(200).json({
      totalReports,
      totalSupervisors,
      totalTenants,
      recentReports: formattedReports,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}
