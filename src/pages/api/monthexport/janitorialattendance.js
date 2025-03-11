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

        console.log(`Filtering Janitorial Attendance from ${fromDate} to ${toDate}`); // Log the date range for debugging

        // Fetch JanitorialAttendance records within the date range
        const janitorialAttendances = await prisma.janitorialAttendance.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },

          orderBy: {
            date: 'asc',  // Order by date to ensure correct ordering
          },

          include: {
            janitorAbsences: true,  // Include related JanitorAbsence data
          },
        });

        console.log(`Found ${janitorialAttendances.length} janitorial attendance records`); // Log how many records were found

        // If no data is found
        if (!janitorialAttendances || janitorialAttendances.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Return the updated data
        return res.status(200).json(janitorialAttendances);
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
