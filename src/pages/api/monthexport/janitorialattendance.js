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

        console.log(`Filtering Janitorial Attendance from ${fromDate} to ${toDate}`);

        // ✅ Fetch Janitorial Attendance records within the date range
        const janitorialAttendances = await prisma.janitorialAttendance.findMany({
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
            janitorAbsences: true, // Include related janitor absences
          },
        });

        console.log(`Found ${janitorialAttendances.length} janitorial attendance records`);

        // If no data is found
        if (!janitorialAttendances || janitorialAttendances.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // ✅ Fetch Supervisor Names and Handle Null Values
        const updatedJanitorialAttendances = await Promise.all(
          janitorialAttendances.map(async (attendance) => {
            let supervisorName = "N/A"; // Default value

            try {
              // Validate if supervisor ID is a number before querying
              const supervisorId = Number(attendance.supervisor);
              if (!isNaN(supervisorId) && supervisorId > 0) {
                const supervisor = await prisma.user.findUnique({
                  where: { id: supervisorId },
                  select: { name: true },
                });

                // Use optional chaining to avoid errors if Prisma returns null
                supervisorName = supervisor?.name ?? "N/A";
              }
            } catch (error) {
              console.error(`Error fetching supervisor (${attendance.supervisor}):`, error);
            }

            return {
              ...attendance,
              supervisor: supervisorName, // Replace ID with Name
            };
          })
        );

        // ✅ Return the final response
        return res.status(200).json(updatedJanitorialAttendances);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
