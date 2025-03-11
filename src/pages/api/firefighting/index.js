import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, firefighterName = '', dateFrom = '', dateTo = '' } = req.query;

    try {
      // Build filter conditions
      const filters = [];
      if (firefighterName) filters.push({ firefighterName: { contains: firefighterName, mode: 'insensitive' } });
      if (dateFrom) filters.push({ date: { gte: new Date(dateFrom) } });
      if (dateTo) filters.push({ date: { lte: new Date(dateTo) } });

      // Fetch firefighting reports from Prisma
      const data = await prisma.fireFighting.findMany({
        where: {
          AND: filters,
        },
        skip: (page - 1) * 10,
        take: 10,
        orderBy: {
          date: 'desc', // Sorting by the date field
        },
      });

      // Total count for pagination
      const totalReports = await prisma.fireFighting.count({
        where: {
          AND: filters,
        },
      });

      const nextPage = totalReports > page * 10;

      res.status(200).json({ data, nextPage });
    } catch (error) {
      console.error('Error fetching firefighting data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        firefighterId,
        createdById, // Pass the user ID from the frontend
        date,
        addressableSmokeStatus,
        fireAlarmingSystemStatus,
        dieselEnginePumpStatus,
        fireextinguisherStatus,
        wetRisersStatus,
        hoseReelCabinetsStatus,
        externalHydrantsStatus,
        waterStorageTanksStatus,
        emergencyLightsStatus,
        remarks,
      } = req.body;
  
      // Fetch firefighter's name using ID
      const firefighter = await prisma.user.findUnique({
        where: { id: parseInt(firefighterId, 10) },
      });
  
      if (!firefighter) {
        return res.status(400).json({ error: 'Invalid firefighter ID' });
      }
  
      // Fetch creator's name using createdById
      const creator = await prisma.user.findUnique({
        where: { id: parseInt(createdById, 10) },
      });
  
      if (!creator) {
        return res.status(400).json({ error: 'Invalid creator ID' });
      }
  
      // Create a new FireFighting report
      const newReport = await prisma.fireFighting.create({
        data: {
          firefighterName: firefighter.name,
          date: new Date(date),
          addressableSmokeStatus,
          fireAlarmingSystemStatus,
          dieselEnginePumpStatus,
          fireextinguisherStatus,
          wetRisersStatus,
          hoseReelCabinetsStatus,
          externalHydrantsStatus,
          waterStorageTanksStatus,
          emergencyLightsStatus,
          remarks,
        },
      });
  
      // Notify Managers
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: 'Manager', // Adjust to match your Role schema
          },
        },
        select: { id: true, name: true },
      });
  
      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Adjust to the appropriate template ID
            userId: manager.id,
            createdById: parseInt(createdById, 10), // The user who created the report
            altText: `A new firefighting report has been submitted by ${creator.name}.`,
            link: `/daily-maintenance/firefighting/view/${newReport.id}`, // Adjust URL as needed
            isRead: false,
            sentAt: new Date(),
          },
        })
      );
  
      await Promise.all(notificationPromises);
  
      res.status(201).json(newReport);
    } catch (error) {
      console.error('Error adding firefighting report:', error);
      res.status(500).json({ error: 'Failed to add report' });
    }
  }
}