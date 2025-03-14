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

        console.log(`Filtering Duty Charts from ${fromDate} to ${toDate}`); // Log the date range for debugging

        // Fetch DutyChart records within the date range
        const dutyCharts = await prisma.dutyChart.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },

          orderBy: {
            date: "asc",
          },

          include: {
            attendance: true, // Include related Attendance data
          },
        });

        console.log(`Found ${dutyCharts.length} duty charts`);

        // If no data is found
        if (!dutyCharts || dutyCharts.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // ✅ Fetch Supervisor Names
        const updatedDutyCharts = await Promise.all(
          dutyCharts.map(async (dutyChart) => {
            let supervisorName = "N/A";

            try {
              // Ensure supervisor ID exists before querying
              if (dutyChart.supervisor && !isNaN(dutyChart.supervisor)) {
                const supervisor = await prisma.user.findUnique({
                  where: { id: Number(dutyChart.supervisor) },
                  select: { name: true },
                });
                supervisorName = supervisor?.name ?? "N/A"; // Handle null values safely
              }
            } catch (error) {
              console.error(`Error fetching supervisor (${dutyChart.supervisor}):`, error);
            }

            return {
              ...dutyChart,
              supervisor: supervisorName, // Replace ID with Name
            };
          })
        );

        // Return the fetched data with updated supervisor names
        return res.status(200).json(updatedDutyCharts);
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
