import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page = 1, plumberName, supervisorName, date } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Build Filters
      const filters = {};
      if (plumberName) {
        const plumber = await prisma.user.findFirst({
          where: { name: { contains: plumberName, mode: "insensitive" }, role: "Plumber" },
        });
        if (plumber) filters.plumberName = plumber.id.toString();
      }
      if (supervisorName) {
        const supervisor = await prisma.user.findFirst({
          where: { name: { contains: supervisorName, mode: "insensitive" }, role: "Supervisor" },
        });
        if (supervisor) filters.supervisorName = supervisor.id.toString();
      }
      if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) filters.date = parsedDate;
      }

      // Fetch Projects with Pagination
      const projects = await prisma.plumbingProject.findMany({
        where: filters,
        include: {
          locations: {
            include: {
              rooms: {
                include: { plumbingCheck: true },
              },
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { date: "desc" },
      });

      // Resolve Names
      const enrichedProjects = await Promise.all(
        projects.map(async (project) => {
          const plumber = await prisma.user.findUnique({
            where: { id: parseInt(project.plumberName) },
            select: { name: true },
          });
          const supervisor = await prisma.user.findUnique({
            where: { id: parseInt(project.supervisorName) },
            select: { name: true },
          });

          return {
            ...project,
            plumberName: plumber?.name || "Unknown",
            supervisorName: supervisor?.name || "Unknown",
          };
        })
      );

      const totalCount = await prisma.plumbingProject.count({ where: filters });

      res.status(200).json({
        data: enrichedProjects,
        totalCount,
        nextPage: offset + limit < totalCount,
      });
    } catch (error) {
      console.error("Error fetching Plumbing Projects:", error);
      res.status(500).json({ error: "Failed to fetch plumbing projects", details: error.message });
    }
  } else if (req.method === "POST") {
    const data = req.body;

    try {
      // Validate IDs
      if (!data.plumberId || !data.supervisorId) {
        return res.status(400).json({ error: "Plumber ID and Supervisor ID are required." });
      }

      const plumberId = parseInt(data.plumberId);
      const supervisorId = parseInt(data.supervisorId);

      // Ensure Plumber and Supervisor exist
      const plumber = await prisma.user.findUnique({
        where: { id: plumberId },
      });
      const supervisor = await prisma.user.findUnique({
        where: { id: supervisorId },
      });

      if (!plumber) {
        return res.status(400).json({ error: "Invalid plumber ID." });
      }
      if (!supervisor) {
        return res.status(400).json({ error: "Invalid supervisor ID." });
      }

      // Create the Plumbing Project along with nested locations, rooms, and plumbing checks
      const project = await prisma.plumbingProject.create({
        data: {
          plumberName: plumberId.toString(), // Store plumberId as string
          supervisorName: supervisorId.toString(), // Store supervisorId as string
          date: new Date(),
          locations: {
            create: data.locations.map((location) => ({
              locationFloor: location.locationFloor,
              locationName: location.locationName,
              remarks: location.remarks || null,
              rooms: {
                create: location.rooms.map((room) => ({
                  roomName: room.roomName,
                  plumbingCheck: {
                    create: {
                      washBasin: room.plumbingCheck.washBasin,
                      shower: room.plumbingCheck.shower,
                      waterTaps: room.plumbingCheck.waterTaps,
                      commode: room.plumbingCheck.commode,
                      indianWC: room.plumbingCheck.indianWC,
                      englishWC: room.plumbingCheck.englishWC,
                      waterFlushKit: room.plumbingCheck.waterFlushKit,
                      waterDrain: room.plumbingCheck.waterDrain,
                    },
                  },
                })),
              },
            })),
          },
        },
        include: {
          locations: {
            include: {
              rooms: {
                include: {
                  plumbingCheck: true,
                },
              },
            },
          },
        },
      });

      // Notify Managers
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: 'Manager', // Adjust to match the `Role` table structure in your schema
          },
        },
        select: { id: true, name: true },
      });

      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Adjust to the appropriate template ID
            userId: manager.id,
            createdById: supervisorId, // Supervisor who created the project
            altText: `A new plumbing project titled "${data.title}" has been created by ${supervisor.name}.`,
            link: `/daily-maintenance/plumbing/view/${project.id}`, // Adjust the URL as needed
            isRead: false,
            sentAt: new Date(),
          },
        })
      );

      await Promise.all(notificationPromises);

      // Send success response
      return res.status(201).json({
        message: "Project created successfully!",
        project,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({
        error: "Failed to create project.",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
  

