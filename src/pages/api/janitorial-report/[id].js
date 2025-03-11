import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid report ID" });
  }

  switch (req.method) {
    case "GET":
      try {
        console.log(`🔍 Fetching Janitorial Report with ID: ${id}`);

        // ✅ Fetch the Janitorial Report
        const janitorialReport = await prisma.janitorialReport.findUnique({
          where: { id: parseInt(id, 10) },
          include: { subJanReport: true },
        });
        console.log("✅ Fetch result:", janitorialReport);
        console.log("🔹 subJanReport:", janitorialReport?.subJanReport);

        if (!janitorialReport) {
          console.log("❌ Janitorial Report not found in database");
          return res.status(404).json({ error: "Janitorial Report not found" });
        }
        
        // ✅ Filter out empty or invalid `subJanReport` entries
        const filteredSubJanReports = janitorialReport.subJanReport.filter(sub => 
          sub.floorNo || sub.toilet || sub.lobby || sub.staircase
        );
        
        let supervisorName = "Unknown Supervisor";

        if (janitorialReport.supervisor) {
          const user = await prisma.user.findUnique({
            where: { id: parseInt(janitorialReport.supervisor) },  // ✅ Fetch supervisor details from User table
            select: { name: true },
          });
          if (user) supervisorName = user.name;
        }

        // ✅ Format the response correctly
        const formattedReport = {
          id: janitorialReport.id,
          date: janitorialReport.date ? new Date(janitorialReport.date).toISOString() : null,
          remarks: janitorialReport.remarks || null,
          supervisor: supervisorName,  // ✅ Use fetched name instead of ID
          tenant: janitorialReport.tenant || "Unknown",
          subJanReport: janitorialReport.subJanReport.filter(sub => 
            sub.floorNo || sub.toilet || sub.lobby || sub.staircase
          ), 
        };

        console.log("✅ Successfully fetched and formatted report:", formattedReport);
        return res.status(200).json(formattedReport);
      } catch (error) {
        console.error("❌ API GET Error:", error);
        console.log("❌ Full error stack:", error.stack); // This will show the detailed error trace
        return res.status(500).json({ error: "Internal server error" });
      }
      break;

    case "PUT":
      try {
        const { date, supervisor, tenant, remarks, subJanReports } = req.body;

        if (!date || !supervisor || !tenant || !Array.isArray(subJanReports)) {
          return res.status(400).json({ error: "Invalid input data" });
        }

        const supervisorString = supervisor.toString();
        const tenantString = tenant.toString();

        // ✅ Find existing subJanReports
        const existingSubReports = await prisma.subJanReport.findMany({
          where: { janitorialReportId: parseInt(id, 10) },
        });

        // ✅ Identify sub-reports to delete
        const subReportsToDelete = existingSubReports.filter(
          (existing) => !subJanReports.some((sub) => sub.id === existing.id)
        );

        if (subReportsToDelete.length > 0) {
          await prisma.subJanReport.deleteMany({
            where: { id: { in: subReportsToDelete.map((sub) => sub.id) } },
          });
        }

        // ✅ Update Janitorial Report
        const updatedReport = await prisma.janitorialReport.update({
          where: { id: parseInt(id, 10) },
          data: {
            date: new Date(date),
            supervisor: supervisorString,
            tenant: tenantString,
            remarks,
          },
        });

        // ✅ Upsert sub-reports
        for (const sub of subJanReports) {
          await prisma.subJanReport.upsert({
            where: { id: sub.id || 0 },
            create: {
              floorNo: sub.floorNo,
              toilet: sub.toilet,
              lobby: sub.lobby,
              staircase: sub.staircase,
              janitorialReportId: updatedReport.id,
            },
            update: {
              floorNo: sub.floorNo,
              toilet: sub.toilet,
              lobby: sub.lobby,
              staircase: sub.staircase,
            },
          });
        }

        const refreshedReport = await prisma.janitorialReport.findUnique({
          where: { id: updatedReport.id },
          include: { subJanReport: true },
        });

        res.status(200).json(refreshedReport);
      } catch (error) {
        console.error("PUT Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
      break;

    case "DELETE":
      try {
        await prisma.janitorialReport.delete({ where: { id: parseInt(id, 10) } });

        res.status(204).end();
      } catch (error) {
        console.error("DELETE Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
      break;
  }
}
