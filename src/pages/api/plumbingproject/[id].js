// pages/api/plumbingproject/[id].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const project = await prisma.plumbingProject.findUnique({
        where: { id: parseInt(id) },
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

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Fetch names for plumber and supervisor based on stored IDs
      const [plumber, supervisor] = await Promise.all([
        prisma.user.findUnique({ where: { id: parseInt(project.plumberName) } }),
        prisma.user.findUnique({ where: { id: parseInt(project.supervisorName) } }),
      ]);

      project.plumberName = plumber?.name || "Unknown";
      project.supervisorName = supervisor?.name || "Unknown";

      return res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({ error: "Failed to fetch project." });
    }
  }

  if (req.method === "PUT") {
    const data = req.body;

    try {
      if (!data.plumberName || !data.supervisorName) {
        return res.status(400).json({ error: "Plumber ID and Supervisor ID are required." });
      }

      const plumberId = parseInt(data.plumberName);
      const supervisorId = parseInt(data.supervisorName);

      // Validate IDs
      const [plumber, supervisor] = await Promise.all([
        prisma.user.findUnique({ where: { id: plumberId } }),
        prisma.user.findUnique({ where: { id: supervisorId } }),
      ]);

      if (!plumber || !supervisor) {
        return res.status(400).json({ error: "Invalid Plumber or Supervisor ID." });
      }

      // Update PlumbingProject
      await prisma.plumbingProject.update({
        where: { id: parseInt(id) },
        data: {
          plumberName: plumberId.toString(), // Store as string
          supervisorName: supervisorId.toString(), // Store as string
        },
      });

      return res.status(200).json({ message: "Project updated successfully!" });
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ error: "Failed to update project.", details: error.message });
    }
  }

  if (req.method === "PUT") {
    const data = req.body;

    try {
      // Update PlumbingProject
      const project = await prisma.plumbingProject.update({
        where: { id: parseInt(id) },
        data: {
          plumberName: data.plumberId.toString(),
          supervisorName: data.supervisorId.toString(),
        },
      });

      // Handle Locations - Create/Update/Delete
      for (const location of data.locations) {
        if (location.id) {
          // Update existing location
          await prisma.location.update({
            where: { id: location.id },
            data: {
              locationFloor: location.locationFloor,
              remarks: location.remarks,
              locationName: location.locationName || `Location on ${location.locationFloor}`,
            },
          });
        } else {
          // Create new location
          const newLocation = await prisma.location.create({
            data: {
              locationFloor: location.locationFloor,
              remarks: location.remarks,
              locationName: location.locationName || `Location on ${location.locationFloor}`,
              plumbingProjectId: parseInt(id),
            },
          });
          location.id = newLocation.id;
        }

        // Handle Rooms - Create/Update/Delete
        for (const room of location.rooms) {
          if (room.id) {
            // Update existing room
            await prisma.room.update({
              where: { id: room.id },
              data: { roomName: room.roomName },
            });
          } else {
            // Create new room
            const newRoom = await prisma.room.create({
              data: {
                roomName: room.roomName,
                locationId: location.id,
              },
            });
            room.id = newRoom.id;
          }

          // Handle PlumbingCheck - Create/Update
          const plumbingCheckData = {
            washBasin: room.plumbingCheck.washBasin,
            shower: room.plumbingCheck.shower,
            waterTaps: room.plumbingCheck.waterTaps,
            commode: room.plumbingCheck.commode,
            indianWC: room.plumbingCheck.indianWC,
            englishWC: room.plumbingCheck.englishWC,
            waterFlushKit: room.plumbingCheck.waterFlushKit,
            waterDrain: room.plumbingCheck.waterDrain,
          };

          if (room.plumbingCheck?.id) {
            // Update existing plumbing check
            await prisma.plumbingCheck.update({
              where: { id: room.plumbingCheck.id },
              data: plumbingCheckData,
            });
          } else {
            // Create new plumbing check
            await prisma.plumbingCheck.create({
              data: {
                ...plumbingCheckData,
                roomId: room.id,
              },
            });
          }
        }

        // Handle Removal of Rooms
        for (const room of location.rooms) {
          if (room.remove) {
            // Remove the plumbing check first
            if (room.plumbingCheck?.id) {
              await prisma.plumbingCheck.delete({
                where: { id: room.plumbingCheck.id },
              });
            }
            // Then remove the room
            await prisma.room.delete({
              where: { id: room.id },
            });
          }
        }

        // Handle Removal of Location
        if (location.remove) {
          // Remove associated rooms and their plumbing checks
          for (const room of location.rooms) {
            if (room.plumbingCheck?.id) {
              await prisma.plumbingCheck.delete({
                where: { id: room.plumbingCheck.id },
              });
            }
            await prisma.room.delete({
              where: { id: room.id },
            });
          }
          // Remove the location itself
          await prisma.location.delete({
            where: { id: location.id },
          });
        }
      }
      
      return res.status(200).json({ message: "Project updated successfully!",project });
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ error: "Failed to update project.", details: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
