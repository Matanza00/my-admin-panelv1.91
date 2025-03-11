import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, supervisorId, operatorId, pumps } = req.body;

    console.log('Received data in API:', req.body);

    // Validate inputs
    if (!title || !description || !supervisorId || !operatorId || !Array.isArray(pumps)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Fetch Supervisor and Operator Names
      const supervisor = await prisma.user.findUnique({
        where: { id: parseInt(supervisorId) },
        select: { name: true },
      });

      const operator = await prisma.user.findUnique({
        where: { id: parseInt(operatorId) },
        select: { name: true },
      });

      if (!supervisor || !operator) {
        return res.status(400).json({ error: 'Invalid Supervisor or Operator ID' });
      }

      // Create the water management entry
      const waterManagement = await prisma.waterManagement.create({
        data: {
          title,
          description,
          supervisorName: supervisor.name, // Use the fetched name
          operatorName: operator.name,     // Use the fetched name
          createdAt: new Date(),           // Default to current timestamp
        },
      });

      // Process pumps and their checks
      const pumpPromises = pumps.map(async (pump) => {
        if (!pump.name || !pump.capacity || !pump.location || !Array.isArray(pump.checks)) {
          throw new Error('Invalid pump data');
        }

        const createdPump = await prisma.pump.create({
          data: {
            name: pump.name,
            capacity: parseFloat(pump.capacity), // Ensure capacity is stored as a float
            location: pump.location,
            waterManagementId: waterManagement.id,
          },
        });

        const pumpCheckPromises = pump.checks.map((check) =>
          prisma.pumpCheck.create({
            data: {
              waterSealStatus: check.waterSeal || 'N/A',
              pumpBearingStatus: check.pumpBearing || 'N/A',
              motorBearingStatus: check.motorBearing || 'N/A',
              rubberCouplingStatus: check.rubberCoupling || 'N/A',
              pumpImpellerStatus: check.pumpImpeller || 'N/A',
              mainValvesStatus: check.mainValves || 'N/A',
              motorWindingStatus: check.motorWinding || 'N/A',
              pumpId: createdPump.id,
            },
          })
        );

        await Promise.all(pumpCheckPromises);
      });

      await Promise.all(pumpPromises);

      // Send Notifications to Managers
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
            templateId: 2, // Assuming template ID for water management notification
            userId: manager.id,
            createdById: parseInt(supervisorId), // Supervisor who created the entry
            altText: `A new water management entry titled "${title}" has been created by ${supervisor.name}.`,
            link: `/daily-maintenance/water-management/view/${waterManagement.id}`, // Redirect link
            isRead: false,
            sentAt: new Date(),
          },
        })
      );

      await Promise.all(notificationPromises);

      // Fetch the complete water management entry for response
      const fullWaterManagement = await prisma.waterManagement.findUnique({
        where: { id: waterManagement.id },
        include: {
          pumps: {
            include: {
              checks: true,
            },
          },
        },
      });

      return res.status(200).json(fullWaterManagement);
    } catch (error) {
      console.error('Error creating water management:', error.message);
      return res.status(500).json({ error: 'Error creating water management entry' });
    }
  } else if (req.method === 'GET') {
    const { page = 1, dateFrom, dateTo } = req.query;

    try {
      const filters = {};

      // Filtering by createdAt
      if (dateFrom) filters.createdAt = { gte: new Date(dateFrom) };
      if (dateTo) filters.createdAt = { lte: new Date(dateTo) };

      const waterManagementEntries = await prisma.waterManagement.findMany({
        where: filters,
        skip: (page - 1) * 10,
        take: 10,
        include: {
          pumps: {
            include: {
              checks: true,
            },
          },
        },
      });

      const totalEntries = await prisma.waterManagement.count({ where: filters });
      const nextPage = page * 10 < totalEntries ? page + 1 : null;

      return res.status(200).json({ data: waterManagementEntries, nextPage });
    } catch (error) {
      console.error('Error fetching water management data:', error.message);
      return res.status(500).json({ error: 'Error fetching water management data' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
