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

        // Fetch Transformer records within the date range
        const transformers = await prisma.transformer.findMany({
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

        console.log(`Found ${transformers.length} transformers`); // Log how many transformers were found

        // If no data is found
        if (!transformers || transformers.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Fetch the engineer name by their ID (unique for all transformers)
        const engineerIds = [...new Set(transformers.map(transformer => transformer.engineer))];
        const engineers = await prisma.user.findMany({
          where: {
            id: { in: engineerIds.map(id => parseInt(id)) },
          },
          select: {
            id: true,
            name: true,
          },
        });

        // Map engineer IDs to names
        const engineerMap = engineers.reduce((acc, engineer) => {
          acc[engineer.id] = engineer.name;
          return acc;
        }, {});

        // Replace engineer ID with the corresponding name in the transformer data
        const updatedTransformers = transformers.map((transformer) => ({
          ...transformer,
          engineer: engineerMap[transformer.engineer] || transformer.engineer,  // Replace ID with name
        }));

        // Return the updated transformer data
        return res.status(200).json(updatedTransformers);
      } catch (error) {
        console.error("Error fetching transformer data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
