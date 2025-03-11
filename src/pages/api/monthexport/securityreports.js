import prisma from "../../../lib/prisma"; // Assuming Prisma client is located here

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

        // Convert 'from' and 'to' to Date objects
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format provided." });
        }

        // Fetch security report records within the date range
        const securityReports = await prisma.securityreport.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },
          orderBy: {
            date: 'asc',  // Order by date to ensure correct ordering
          },
        });

        // If no data is found
        if (!securityReports || securityReports.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Replace 'observedBy' and 'supervisor' IDs with their respective names
        const updatedReports = await Promise.all(
          securityReports.map(async (report) => {
            // Fetch user names for observedBy and supervisor by their IDs
            const observedByUser = await prisma.user.findUnique({
              where: { id: report.observedBy },
            });
            const supervisorUser = await prisma.user.findUnique({
              where: { id: report.supervisor },
            });

            // Replace the IDs with their respective names
            return {
              ...report,
              observedBy: observedByUser ? observedByUser.name : null,
              supervisor: supervisorUser ? supervisorUser.name : null,
            };
          })
        );

        // Return the updated data
        return res.status(200).json(updatedReports);
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
