import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper function to remove old images if a new one is uploaded
const removeOldImage = (oldImagePath) => {
  if (oldImagePath) {
    const fullImagePath = path.join(process.cwd(), "public", oldImagePath);
    if (fs.existsSync(fullImagePath)) {
      fs.unlinkSync(fullImagePath);
    }
  }
};

// Helper function to format datetime strings
const formatDateTime = (dateTime) => {
  if (!dateTime) return null; // Return null for empty or invalid fields
  const parsedDate = new Date(dateTime);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "PUT":
      try {
        const { date, supervisor, remarks, picture, attendance } = req.body;

        // Update the DutyChart
        const dutyChart = await prisma.dutyChart.update({
          where: { id: parseInt(id) },
          data: {
            date,
            supervisor,
            remarks,
            picture,
          },
        });

        // Extract the IDs of attendance records from the request
        const attendanceIds = attendance.map((att) => att.id).filter((id) => id);

        // Delete any attendance records not included in the request
        await prisma.attendance.deleteMany({
          where: {
            dutyChartId: parseInt(id),
            id: {
              notIn: attendanceIds,
            },
          },
        });

        // Handle attendance with upsert to update or create records
        for (const att of attendance) {
          await prisma.attendance.upsert({
            where: { id: att.id || 0 }, // If `id` exists, attempt to update; otherwise, treat as a new record
            update: {
              name: att.name,
              designation: att.designation,
              department: att.department,
              timeIn: formatDateTime(att.timeIn),
              timeOut: formatDateTime(att.timeOut),
              lunchIn: formatDateTime(att.lunchIn),
              lunchOut: formatDateTime(att.lunchOut),
              updatedAt: new Date().toISOString(),
              deletedAt: null, // Reactivate attendance if it was soft-deleted
            },
            create: {
              name: att.name,
              designation: att.designation,
              department: att.department,
              timeIn: formatDateTime(att.timeIn),
              timeOut: formatDateTime(att.timeOut),
              lunchIn: formatDateTime(att.lunchIn),
              lunchOut: formatDateTime(att.lunchOut),
              dutyChartId: parseInt(id),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
            },
          });
        }

        // If a picture is provided and it's different from the existing one, delete the old image
        if (picture !== dutyChart.picture) {
          removeOldImage(dutyChart.picture);
        }

        res.status(200).json({ message: "Duty chart updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating the duty chart" });
      }
      break;

      case "GET":
  try {
    console.log(`🔍 Fetching duty chart with ID: ${id}`);

    // Fetch the duty chart with its related attendance
    const dutyChart = await prisma.dutyChart.findUnique({
      where: { id: parseInt(id) },
      include: {
        attendance: true, // Include attendance data
      },
    });

    if (!dutyChart) {
      console.error(`❌ Duty chart not found for ID: ${id}`);
      return res.status(404).json({ error: "Duty chart not found" });
    }

    console.log("✅ Duty chart fetched:", dutyChart);

    // Ensure supervisor field exists and is a valid number
    const supervisorId = dutyChart.supervisor ? parseInt(dutyChart.supervisor) : null;

    let supervisorName = "Unknown";

    if (!isNaN(supervisorId) && supervisorId !== null) {
      const supervisor = await prisma.user.findUnique({
        where: { id: supervisorId },
        select: { name: true },
      });

      supervisorName = supervisor ? supervisor.name : "Unknown";
    }

    // Replace the supervisor field with the supervisor's name
    const dutyChartWithSupervisorName = {
      ...dutyChart,
      supervisor: supervisorName,
    };

    console.log("✅ Sending response:", dutyChartWithSupervisorName);
    res.status(200).json(dutyChartWithSupervisorName);
  } catch (error) {
    console.error("❌ Error fetching the duty chart:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
  break;

      
    default:
      res.status(405).json({ error: `Method ${method} Not Allowed` });
      break;
  }
};

export default handler;
