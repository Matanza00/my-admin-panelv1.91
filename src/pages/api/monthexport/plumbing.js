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

        // Fetch PlumbingProject records within the date range
        const plumbingProjects = await prisma.plumbingProject.findMany({
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },
          include: {
            locations: {
              include: {
                rooms: {
                  include: {
                    plumbingCheck: true,  // Include plumbing check for each room
                  },
                },
              },
            },
          },
        });

        // If no data is found
        if (!plumbingProjects || plumbingProjects.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Extract unique user IDs (plumberName and supervisorName) from the data
        const plumberIds = plumbingProjects.map(project => parseInt(project.plumberName));
        const supervisorIds = plumbingProjects.map(project => parseInt(project.supervisorName));

        // Fetch user names from the user table based on the extracted IDs
        const users = await prisma.user.findMany({
          where: {
            id: { in: [...new Set([...plumberIds, ...supervisorIds])] },
          },
          select: {
            id: true,
            name: true,
          },
        });

        // Create a map for quick lookup of user names by their ID
        const userMap = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});

        // Replace IDs with names in the plumbingProjects data
        const updatedPlumbingProjects = plumbingProjects.map(project => ({
          ...project,
          plumberName: userMap[parseInt(project.plumberName)] || project.plumberName,  // Replace ID with name
          supervisorName: userMap[parseInt(project.supervisorName)] || project.supervisorName,  // Replace ID with name
          locations: project.locations.map(location => ({
            ...location,
            rooms: location.rooms.map(room => ({
              ...room,
              plumbingCheck: room.plumbingCheck,  // Plumbing check remains unchanged
            }))
          }))
        }));

        return res.status(200).json(updatedPlumbingProjects);
      } catch (error) {
        console.error("Error fetching plumbing project data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
