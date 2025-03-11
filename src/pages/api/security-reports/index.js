import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Fetch all reports
      const reports = await prisma.securityreport.findMany({
        orderBy: { date: "desc" },
      });

      // Fetch associated user names for observedBy and supervisor
      const enrichedReports = await Promise.all(
        reports.map(async (report) => {
          const observedByUser = await prisma.user.findUnique({
            where: { id: report.observedBy },
            select: { name: true },
          });

          const supervisorUser = await prisma.user.findUnique({
            where: { id: report.supervisor },
            select: { name: true },
          });

          return {
            ...report,
            observedByName: observedByUser?.name || "Unknown",
            supervisorName: supervisorUser?.name || "Unknown",
          };
        })
      );

      return res.status(200).json(enrichedReports);
    }

    if (req.method === "POST") {
      // Destructure request body
      const {
        date,
        observedBy,
        supervisor,
        description,
        action,
        timeNoted,
        timeSolved,
        createdById, // Added field for tracking who created the report
      } = req.body;

      // Validate required fields
      if (!date || !observedBy || !supervisor || !description || !action || !timeNoted || !createdById) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Parse date and time
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const parsedTimeNoted = new Date(`${date}T${timeNoted}:00`);
      if (isNaN(parsedTimeNoted)) {
        return res.status(400).json({ error: "Invalid timeNoted format" });
      }

      const parsedTimeSolved = timeSolved
        ? new Date(`${date}T${timeSolved}:00`)
        : null;

      // Create a new security report
      const newReport = await prisma.securityreport.create({
        data: {
          date: parsedDate,
          observedBy: parseInt(observedBy), // Save as integer ID
          supervisor: parseInt(supervisor), // Save as integer ID
          description,
          action,
          timeNoted: parsedTimeNoted,
          timeSolved: parsedTimeSolved,
        },
      });

      // Notify Managers
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: "Manager", // Adjust this to match your schema
          },
        },
        select: { id: true, name: true },
      });

      const creator = await prisma.user.findUnique({
        where: { id: parseInt(createdById, 10) },
        select: { name: true },
      });

      if (!creator) {
        throw new Error("Invalid createdById");
      }

      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Adjust to the appropriate template ID
            userId: manager.id,
            createdById: parseInt(createdById, 10),
            altText: `A new security report has been created by ${creator.name}.`,
            link: `/security-services/security-reports/view/${newReport.id}`, // Adjust URL as needed
            isRead: false,
            sentAt: new Date(),
          },
        })
      );

      await Promise.all(notificationPromises);

      return res.status(201).json(newReport);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error in API:", error); // Log the full error
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
