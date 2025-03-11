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

        // Fetch FireFighting records within the date range
        const fireFightingRecords = await prisma.fireFighting.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },
        });

        // If no data is found
        if (!fireFightingRecords || fireFightingRecords.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Simply return the data as is (no lookup in user table)
        return res.status(200).json(fireFightingRecords);
      } catch (error) {
        console.error("Error fetching fire fighting data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
