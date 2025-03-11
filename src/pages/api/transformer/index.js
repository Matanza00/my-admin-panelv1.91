import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    method,
    query: {
      page = 1,
      transformerNo,
      date,
      lastMaintenance,
      nextMaintenance,
      temp,
      voltage,
      sortBy,
      sortOrder,
    },
    body,
  } = req;

  const pageSize = 10;
  const skip = (parseInt(page) - 1) * pageSize;

  try {
    if (method === "GET") {
      // Fetch transformers with filters, pagination, and sorting
      const where = {};

      if (transformerNo) {
        where.transformerNo = {
          contains: transformerNo,
          mode: "insensitive",
        };
      }

      if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          where.date = parsedDate;
        }
      }

      if (lastMaintenance) {
        const parsedLastMaintenance = new Date(lastMaintenance);
        if (!isNaN(parsedLastMaintenance)) {
          where.lastMaintenance = parsedLastMaintenance;
        }
      }

      if (nextMaintenance) {
        const parsedNextMaintenance = new Date(nextMaintenance);
        if (!isNaN(parsedNextMaintenance)) {
          where.nextMaintenance = parsedNextMaintenance;
        }
      }

      if (temp) {
        const parsedTemp = parseFloat(temp);
        if (!isNaN(parsedTemp)) {
          where.temp = parsedTemp;
        }
      }

      if (voltage) {
        const parsedVoltage = parseFloat(voltage);
        if (!isNaN(parsedVoltage)) {
          where.voltage = parsedVoltage;
        }
      }

      const orderBy = sortBy
        ? { [sortBy]: sortOrder === "desc" ? "desc" : "asc" }
        : { date: "desc" };

      const transformers = await prisma.transformer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      });

      const enrichedTransformers = await Promise.all(
        transformers.map(async (transformer) => {
          const engineer = transformer.engineer
            ? await prisma.user.findUnique({
                where: { id: transformer.engineer },
                select: { name: true },
              })
            : null;

          return {
            ...transformer,
            engineerName: engineer?.name || "Unknown",
          };
        })
      );

      const count = await prisma.transformer.count({ where });
      const nextPage = skip + pageSize < count;

      return res.status(200).json({
        data: enrichedTransformers,
        currentPage: parseInt(page),
        nextPage: nextPage ? page + 1 : null,
        totalRecords: count,
      });
    } else if (method === "POST") {
      // Create a new transformer entry
      const {
        transformerNo,
        date,
        lastMaintenance,
        nextMaintenance,
        lastDehydration,
        nextDehydration,
        temp,
        tempStatus,
        HTvoltage,
        HTStatus,
        LTvoltage,
        LTStatus,
        engineerId,
        createdById, // Captured from frontend
      } = body;
    
      console.log(req.body);
    
      if (!transformerNo) {
        return res.status(400).json({ error: "Transformer No is required" });
      }
    
      const parsedEngineer = engineerId ? parseInt(engineerId) : null;
      if (!parsedEngineer || isNaN(parsedEngineer)) {
        return res.status(400).json({ error: "Valid Engineer ID is required" });
      }
    
      // Determine temperature status if not provided
      const calculatedTempStatus =
        temp < 40 ? "Low" : temp > 50 ? "High" : "Normal";
    
      // HT and LT voltage status handling
      const calculatedHTStatus = HTvoltage ? (HTvoltage < 220 ? "Low" : HTvoltage > 250 ? "High" : "Normal") : null;
      const calculatedLTStatus = LTvoltage ? (LTvoltage < 220 ? "Low" : LTvoltage > 250 ? "High" : "Normal") : null;
    
      const newTransformer = await prisma.transformer.create({
        data: {
          transformerNo,
          date: date ? new Date(date) : new Date(),
          lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : null,
          nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
          lastDehydration: lastDehydration ? new Date(lastDehydration) : null,
          nextDehydration: nextDehydration ? new Date(nextDehydration) : null,
          temp: temp ? parseFloat(temp) : null,
          tempStatus: tempStatus || calculatedTempStatus, // Save calculated or provided status
          HTvoltage: HTvoltage ? parseFloat(HTvoltage) : null, // Save HT voltage if provided
          HTStatus: HTStatus || calculatedHTStatus, // Save HT status if provided or calculated
          LTvoltage: LTvoltage ? parseFloat(LTvoltage) : null, // Save LT voltage if provided
          LTStatus: LTStatus || calculatedLTStatus, // Save LT status if provided or calculated
          engineer: parsedEngineer,
        },
      });
    
      // Fetch creator's details
      const creator = await prisma.user.findUnique({
        where: { id: parseInt(createdById, 10) },
        select: { name: true },
      });
    
      if (!creator) {
        return res.status(400).json({ error: "Invalid creator ID" });
      }
    
      // Notify Managers
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: "Manager", // Adjust as per your role schema
          },
        },
        select: { id: true, name: true },
      });
    
      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Adjust template ID
            userId: manager.id,
            createdById: parseInt(createdById, 10),
            altText: `A new transformer report has been created by ${creator.name}.`,
            link: `/daily-maintenance/transformer/view/${newTransformer.id}`,
            isRead: false,
            sentAt: new Date(),
          },
        })
      );
    
      await Promise.all(notificationPromises);
    
      return res.status(201).json(newTransformer);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
