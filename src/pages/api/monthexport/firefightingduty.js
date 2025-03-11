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

        console.log(`Filtering from ${fromDate} to ${toDate}`); // Log the date range for debugging

        // Fetch FirefightingDuty records within the date range
        const firefightingDuties = await prisma.firefightingDuty.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },
          include: {
            users: true, // Include related users
          },
          orderBy: {
            date: 'asc',  // Order by date to ensure correct ordering
          },
        });

        console.log(`Found ${firefightingDuties.length} firefighting duties`); // Log how many duties were found

        // If no data is found
        if (!firefightingDuties || firefightingDuties.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Map the firefighting duties and their users
        const updatedFirefightingDuties = firefightingDuties.map((duty) => ({
          ...duty,
          users: duty.users.map(user => ({
            id: user.id,
            name: user.name, // Assuming user has a 'name' field
            role: user.role, // Assuming user has a 'role' field
          })),
        }));

        // Return the updated data
        return res.status(200).json(updatedFirefightingDuties);
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
