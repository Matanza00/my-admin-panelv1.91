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

        // Fetch AbsorbtionChiller records within the date range
        const absorbtionChillers = await prisma.absorbtionChiller.findMany({
          where: {
            Date: {
              gte: fromDate,
              lte: toDate,
            },
          },
          include: {
            Chillers: true,
          },
        });

        // If no data is found
        if (!absorbtionChillers || absorbtionChillers.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Fetch User data for each ID involved
        const operatorIds = absorbtionChillers.map(chiller => parseInt(chiller.OperatorName));
        const supervisorIds = absorbtionChillers.map(chiller => parseInt(chiller.SupervisorName));
        const assistantSupervisorIds = absorbtionChillers.flatMap(chiller => chiller.Chillers.map(ch => parseInt(ch.assistantSupervisor)));

        // Get unique user IDs from all fields
        const allUserIds = [...new Set([...operatorIds, ...supervisorIds, ...assistantSupervisorIds])];
        console.log(allUserIds);

        // Fetch user names by their IDs
        const users = await prisma.user.findMany({
          where: {
            id: { in: allUserIds },
          },
          select: {
            id: true,
            name: true,
          },
        });
        console.log(users);

        // Map user ID to name for quick lookup
        const userMap = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});

        // Replace the IDs with names, with fallback for missing users
        const updatedAbsorbtionChillers = absorbtionChillers.map(chiller => ({
          ...chiller,
          OperatorName: userMap[chiller.OperatorName] || chiller.OperatorName,  // Replace ID with name
          SupervisorName: userMap[chiller.SupervisorName] || chiller.SupervisorName,  // Replace ID with name
          EngineerName: userMap[chiller.EngineerName] || chiller.EngineerName,  // Replace ID with name
          Chillers: chiller.Chillers.map(ch => ({
            ...ch,
            assistantSupervisor: userMap[ch.assistantSupervisor] || "Unknown User",  // Replace ID with name or set default value
          })),
        }));

        return res.status(200).json(updatedAbsorbtionChillers);
      } catch (error) {
        console.error("Error fetching absorbtion chiller data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
