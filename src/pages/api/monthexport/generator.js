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

        // Convert 'from' and 'to' to Date objects
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format provided." });
        }

        console.log(`Filtering from ${fromDate} to ${toDate}`); // Log the date range for debugging

        // Fetch Generator records within the date range
        const generators = await prisma.generator.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },
          include: {
            generatorFuel: true, // Include related GeneratorFuel data
          },
          orderBy: {
            date: 'asc',  // Ensure generators are ordered by date to easily find previous entries
          },
        });

        console.log(`Found ${generators.length} generators`); // Log how many generators were found

        // If no data is found
        if (!generators || generators.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Gather all electrician and engineer IDs from the generators
        const userIds = generators.flatMap(generator => [
          parseInt(generator.electricianName),
          parseInt(generator.engineerName)
        ]);

        // Remove duplicates to only fetch unique user IDs
        const uniqueUserIds = [...new Set(userIds)];

        // Fetch user names from the database
        const users = await prisma.user.findMany({
          where: {
            id: { in: uniqueUserIds },
          },
          select: {
            id: true,
            name: true,
          },
        });

        // Create a map of user ID to user name
        const userMap = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});

        // Prepare updated generators data
        const updatedGenerators = generators.map((generator, index) => {
          let lastHrs = 0;
          let lastDate = null;

          // Set lastHrs and lastDate from previous entry if it exists
          if (index > 0) {
            lastHrs = generators[index - 1].currHrs;
            lastDate = generators[index - 1].currDate;
          }

          return {
            ...generator,
            lastHrs: lastHrs,
            lastDate: lastDate,
            electricianName: userMap[parseInt(generator.electricianName)] || generator.electricianName,
            engineerName: userMap[parseInt(generator.engineerName)] || generator.engineerName,
            generatorFuel: generator.generatorFuel.map(fuel => ({
              ...fuel,
            })),
          };
        });

        // Return the updated generator data
        return res.status(200).json(updatedGenerators);
      } catch (error) {
        console.error("Error fetching generator data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
