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
    console.log("🔹 Received PUT request for Project ID:", id);
    console.log("📥 Incoming Data:", JSON.stringify(data, null, 2));

    try {
      if (!data.plumberName || !data.supervisorName) {
        console.error("❌ Missing plumberName or supervisorName");
        return res.status(400).json({ error: "Plumber and Supervisor IDs are required." });
      }

      const plumberId = parseInt(data.plumberName);
      const supervisorId = parseInt(data.supervisorName);

      // Validate IDs
      const [plumber, supervisor] = await Promise.all([
        prisma.user.findUnique({ where: { id: plumberId } }),
        prisma.user.findUnique({ where: { id: supervisorId } }),
      ]);

      if (!plumber || !supervisor) {
        console.error("❌ Invalid Plumber or Supervisor ID");
        return res.status(400).json({ error: "Invalid Plumber or Supervisor ID." });
      }

      // ✅ Update Plumbing Project
      console.log("🔄 Updating Plumbing Project...");
      await prisma.plumbingProject.update({
        where: { id: parseInt(id) },
        data: {
          plumberName: plumberId.toString(),
          supervisorName: supervisorId.toString(),
        },
      });
      console.log("✅ Plumbing Project Updated");

      // ✅ Handle Locations, Rooms, and Plumbing Checks
      for (const location of data.locations || []) {
        let updatedLocation;
        if (location.id) {
          console.log(`🔄 Updating Location ID: ${location.id}`);
          updatedLocation = await prisma.location.update({
            where: { id: location.id },
            data: {
              locationFloor: location.locationFloor,
              locationName: location.locationName || `Location on ${location.locationFloor}`,
              remarks: location.remarks || null,
            },
          });
        } else {
          console.log("🆕 Creating a New Location...");
          updatedLocation = await prisma.location.create({
            data: {
              locationFloor: location.locationFloor,
              locationName: location.locationName || `Location on ${location.locationFloor}`,
              remarks: location.remarks || null,
              plumbingProjectId: parseInt(id),
            },
          });
        }
        console.log("✅ Location Updated/Created:", updatedLocation);

        // ✅ Handle Rooms
        for (const room of location.rooms || []) {
          let updatedRoom;
          if (room.id) {
            console.log(`🔄 Updating Room ID: ${room.id}`);
            updatedRoom = await prisma.room.update({
              where: { id: room.id },
              data: { roomName: room.roomName },
            });
          } else {
            console.log("🆕 Creating a New Room...");
            updatedRoom = await prisma.room.create({
              data: {
                roomName: room.roomName,
                locationId: updatedLocation.id,
              },
            });
          }
          console.log("✅ Room Updated/Created:", updatedRoom);

          // ✅ Ensure plumbingCheck exists before processing
          if (!room.plumbingCheck || typeof room.plumbingCheck !== "object") {
            console.warn(`⚠️ Skipping plumbing check for Room ID ${updatedRoom.id}, no data provided`);
            continue;
          }

          // ✅ Ensure plumbingCheck ID is valid
          let plumbingCheckId = room.plumbingCheck?.id;
          if (!plumbingCheckId || typeof plumbingCheckId !== "number") {
            console.warn(`⚠️ Invalid Plumbing Check ID (${plumbingCheckId}) received, setting to null.`);
            plumbingCheckId = null;
          }

          const plumbingCheckData = {
            washBasin: !!room.plumbingCheck?.washBasin,
            shower: !!room.plumbingCheck?.shower,
            waterTaps: !!room.plumbingCheck?.waterTaps,
            commode: !!room.plumbingCheck?.commode,
            indianWC: !!room.plumbingCheck?.indianWC,
            englishWC: !!room.plumbingCheck?.englishWC,
            waterFlushKit: !!room.plumbingCheck?.waterFlushKit,
            waterDrain: !!room.plumbingCheck?.waterDrain,
          };

          console.log(`📊 Plumbing Check Data for Room ${updatedRoom.id}:`, plumbingCheckData);

          if (plumbingCheckId) {
            console.log(`🔄 Updating Plumbing Check ID: ${plumbingCheckId}`);
            await prisma.plumbingCheck.update({
              where: { id: plumbingCheckId },
              data: plumbingCheckData,
            });
          } else {
            console.log("🆕 Creating a New Plumbing Check...");
            await prisma.plumbingCheck.create({
              data: {
                ...plumbingCheckData,
                roomId: updatedRoom.id, // Ensuring roomId is assigned
              },
            });
          }
          console.log("✅ Plumbing Check Updated/Created");
        }
      }

      console.log("✅ PUT Request Completed Successfully");
      return res.status(200).json({ message: "Project updated successfully!" });
    } catch (error) {
      console.error("❌ Error Updating Project:", error);
      return res.status(500).json({ error: "Failed to update project.", details: error.message });
    }
  }




  

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
