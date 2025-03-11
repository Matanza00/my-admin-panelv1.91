import { PrismaClient } from '@prisma/client'; // Import Prisma Client directly
import { getSession } from 'next-auth/react'; // Ensure authentication is used

const prisma = new PrismaClient(); // Initialize Prisma client

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { supervisor, dateFrom, dateTo, page = 1 } = req.query;

    const filters = {};
    if (supervisor) filters.supervisor = { contains: supervisor, mode: 'insensitive' };
    if (dateFrom) filters.date = { gte: new Date(dateFrom) };
    if (dateTo) filters.date = { lte: new Date(dateTo) };

    // The tenant filter logic is now removed from the API, handled by getServerSideProps instead.
    console.log("🔍 Query Filters:", filters); // Log filters before querying DB
    

    try {
      
      const reports = await prisma.janitorialReport.findMany({
        where: filters,
        skip: (page - 1) * 10,
        take: 10,
        include: {
          subJanReport: true,
        },
      });
      let supervisorName = "Unknown Supervisor";

        if (reports.supervisor) {
          const user = await prisma.user.findUnique({
            where: { id: parseInt(reports.supervisor) },  // ✅ Fetch supervisor details from User table
            select: { name: true },
          });
          if (user) supervisorName = user.name;
        }
        console.log("supervisorName1211",supervisorName)

      console.log("🔹 Reports Fetched:", reports.length);
      const formattedReport = {
        id: reports.id,
        date: reports.date ? new Date(janitorialReport.date).toISOString() : null,
        remarks: reports.remarks || null,
        supervisor: supervisorName,  // ✅ Use fetched name instead of ID
        tenant: reports.tenant || "Unknown",
        subJanReport: reports.subJanReport.filter(sub => 
          sub.floorNo || sub.toilet || sub.lobby || sub.staircase
        ), 
      };
      console.log("🔹 Reports Fetched 111:", formattedReport)
      console.log("✅ Successfully fetched and formatted report:", formattedReport);
      return res.status(200).json({
        data: reports,
        nextPage: reports.length === 10 ? page + 1 : null,
      });
    } catch (error) {
      console.error("❌ API Fetch Error:", error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  else if (req.method === 'POST') {
    const { date, supervisor, tenant, remarks, subJanReports, createdById } = req.body;

    if (!date || !supervisor || !tenant || !subJanReports || !subJanReports.length || !createdById) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validDate = new Date(date);
    if (isNaN(validDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const formattedDate = validDate.toISOString();

    try {
      const janitorialReport = await prisma.janitorialReport.create({
        data: {
          date: formattedDate,
          supervisor: supervisor.toString(),
          tenant: tenant.toString(),
          remarks,
          subJanReport: {
            create: subJanReports.map((subReport) => ({
              floorNo: subReport.floorNo,
              toilet: subReport.toilet,
              lobby: subReport.lobby,
              staircase: subReport.staircase,
            })),
          },
        },
        include: {
          subJanReport: true,
        },
      });

      res.status(201).json(janitorialReport);
    } catch (error) {
      console.error("Error creating Janitorial Report:", error);
      res.status(500).json({ error: 'Failed to create Janitorial Report' });
    }
  }
}
