import prisma from "../../../lib/prisma";  // Your Prisma client

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { from, to } = req.query;

        // Validate 'from' and 'to' query params
        if (!from || !to) {
          return res.status(400).json({ error: "'from' and 'to' query parameters are required." });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate) || isNaN(toDate)) {
          return res.status(400).json({ error: "Invalid date format provided." });
        }

        // Fetch WaterManagement records within the date range
        const waterManagementRecords = await prisma.waterManagement.findMany({
          where: {
            createdAt: {
              gte: fromDate,
              lte: toDate,
            },
          },
          include: {
            pumps: {
              include: {
                checks: true, // Include associated pump checks for each pump
              },
            },
          },
        });

        // If no data is found
        if (!waterManagementRecords || waterManagementRecords.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        return res.status(200).json(waterManagementRecords);
      } catch (error) {
        console.error("Error fetching water management data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
