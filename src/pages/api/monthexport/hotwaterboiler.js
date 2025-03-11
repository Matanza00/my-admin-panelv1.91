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

        // Fetch HotWaterBoiler records within the date range
        const hotWaterBoilers = await prisma.hotWaterBoiler.findMany({
          where: {
            Date: {
              gte: fromDate,
              lte: toDate,
            },
          },
          include: {
            TimeHr: true,
          },
        });

        // If no data is found
        if (!hotWaterBoilers || hotWaterBoilers.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Fetch User data for each ID involved
        const operatorIds = hotWaterBoilers.map(boiler => parseInt(boiler.OperatorName));
        const supervisorIds = hotWaterBoilers.map(boiler => parseInt(boiler.SupervisorName));
        const assistantSupervisorIds = hotWaterBoilers.flatMap(boiler => boiler.TimeHr.map(hr => parseInt(hr.assistantSupervisor)));

        // Get unique user IDs from all fields
        const allUserIds = [...new Set([...operatorIds, ...supervisorIds, ...assistantSupervisorIds])];
        console.log(allUserIds)
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
        console.log(users)

        // Map user ID to name for quick lookup
        const userMap = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});

        // Replace the IDs with names
        const updatedHotWaterBoilers = hotWaterBoilers.map(boiler => ({
          ...boiler,
          OperatorName: userMap[boiler.OperatorName] || boiler.OperatorName,  // Replace ID with name
          SupervisorName: userMap[boiler.SupervisorName] || boiler.SupervisorName,  // Replace ID with name
          EngineerName: userMap[boiler.EngineerName] || boiler.EngineerName,  // Replace ID with name
          TimeHr: boiler.TimeHr.map(timeHr => ({
            ...timeHr,
            assistantSupervisor: userMap[timeHr.assistantSupervisor] || timeHr.assistantSupervisor,  // Replace ID with name
          })),
        }));

        return res.status(200).json(updatedHotWaterBoilers);
      } catch (error) {
        console.error("Error fetching hot water boiler data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
