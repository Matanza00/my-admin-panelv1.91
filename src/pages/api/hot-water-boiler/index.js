// File: pages/api/hot-water-boiler/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { query, method } = req;
  const { page = 1, operatorName, supervisorName, floorFrom, floorTo } = query;

  if (method === 'GET') {
    const take = 10;  // Number of items per page
    const skip = (page - 1) * take;

    try {
      // Construct filter conditions
      const where = {};
      if (operatorName) where.OperatorName = { contains: operatorName };
      if (supervisorName) where.SupervisorName = { contains: supervisorName };
      if (floorFrom) where.StartTime = { gte: new Date(floorFrom) };
      if (floorTo) where.ShutdownTime = { lte: new Date(floorTo) };

      // Fetch filtered data and total count
      const boilers = await prisma.hotWaterBoiler.findMany({
        where,
        take,
        skip,
      });

      const totalCount = await prisma.hotWaterBoiler.count({ where });

      // Determine if there are more pages
      const nextPage = totalCount > page * take;

      return res.status(200).json({ data: boilers, nextPage });
    } catch (error) {
      console.error('Error fetching boilers:', error);
      return res.status(500).json({ error: 'Error fetching boilers' });
    }
  }  if (method === 'POST') {
    const {
      StartTime,
      ShutdownTime,
      Remarks,
      OperatorName,
      SupervisorName,
      TimeHr, // Array of TimeHr entries
      createdById, // ID of the person who created this form
    } = req.body;
  
    if (
      !StartTime ||
      !ShutdownTime ||
      !Remarks ||
      !OperatorName ||
      !SupervisorName ||
      !Array.isArray(TimeHr) ||
      !createdById
    ) {
      return res.status(400).json({ error: 'Invalid payload, all fields are required' });
    }
  
    try {
      const formattedStartTime = new Date(StartTime);
      const formattedShutdownTime = new Date(ShutdownTime);
  
      // Fetch the name of the person who created the form
      const creator = await prisma.user.findUnique({
        where: { id: parseInt(createdById, 10) },
        select: { name: true },
      });
  
      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }
  
      // Create a new HotWaterBoiler entry
      const newBoiler = await prisma.hotWaterBoiler.create({
        data: {
          StartTime: formattedStartTime,
          ShutdownTime: formattedShutdownTime,
          Remarks,
          OperatorName,
          SupervisorName,
        },
      });
  
      // Create associated TimeHr entries for the boiler
      const timeHrEntries = TimeHr.map((entry) => ({
        HotWaterIn: parseFloat(entry.HotWaterIn),
        HotWaterOut: parseFloat(entry.HotWaterOut),
        ExhaustTemp: parseFloat(entry.ExhaustTemp),
        FurnacePressure: parseFloat(entry.FurnacePressure),
        assistantSupervisor: entry.assistantSupervisor || '',
        boilerId: newBoiler.id,
      }));
  
      await prisma.timeHour.createMany({
        data: timeHrEntries,
      });
  
      // Fetch target users for notifications (e.g., supervisors or managers)
      const targetUsers = await prisma.user.findMany({
        where: {
          role: {
            name: 'Manager', // Adjust based on your roles
          },
        },
      });
      // Construct the report link
      const reportLink = `/daily-maintenance/absorptionchiller/view/${newBoiler.id}`;
      // Create notifications for the target users
      const notificationPromises = targetUsers.map((user) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Notification template ID for hot-water-boiler
            userId: user.id,
            createdById: parseInt(createdById, 10),
            altText: `A new hot-water-boiler report has been created by ${creator.name}.`,
            link: reportLink, // Add the report link here
            isRead: false,
            sentAt: new Date(),
          },
        })
      );
  
      await Promise.all(notificationPromises);
  
      return res.status(201).json(newBoiler);
    } catch (error) {
      console.error('Error creating boiler:', error);
      return res.status(500).json({ error: 'Error creating boiler' });
    }
  
  
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
