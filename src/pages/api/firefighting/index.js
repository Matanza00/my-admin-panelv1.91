import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, firefighterName = '', dateFrom = '', dateTo = '', type = 'fireFighting' } = req.query;

    // Ensure correct model selection
    const model = type === 'fireFightingAlarm' ? prisma.fireFightingAlarm : prisma.fireFighting;

    try {
      const filters = [];
      if (firefighterName) filters.push({ firefighterName: { contains: firefighterName, mode: 'insensitive' } });
      if (dateFrom) filters.push({ date: { gte: new Date(dateFrom) } });
      if (dateTo) filters.push({ date: { lte: new Date(dateTo) } });

      const data = await model.findMany({
        where: {
          AND: filters,
          deletedAt: null, // Ignore soft-deleted records
        },
        skip: (page - 1) * 10,
        take: 10,
        orderBy: { date: 'desc' },
      });

      const totalReports = await model.count({
        where: {
          AND: filters,
          deletedAt: null,
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
        type = 'fireFighting', // Determines which model to use
        firefighterId,
        createdById, // Pass the user ID from the frontend
        date,
        addressableSmokeStatus,
        fireAlarmingSystemStatus,
        dieselEnginePumpStatus,
        wetRisersStatus,
        hoseReelCabinetsStatus,
        externalHydrantsStatus,
        waterStorageTanksStatus,
        emergencyLightsStatus,
        remarks,
      } = req.body;

      // Validate type
      if (!['fireFighting', 'fireFightingAlarm'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }

      // Fetch firefighter's name using ID
      const firefighter = await prisma.user.findUnique({ where: { id: parseInt(firefighterId, 10) } });

      if (!firefighter) {
        return res.status(400).json({ error: 'Invalid firefighter ID' });
      }

      // Fetch creator's name using createdById
      const creator = await prisma.user.findUnique({ where: { id: parseInt(createdById, 10) } });

      if (!creator) {
        return res.status(400).json({ error: 'Invalid creator ID' });
      }

      // Determine model
      const model = type === 'fireFightingAlarm' ? prisma.fireFightingAlarm : prisma.fireFighting;

      // Create a new report
      const newReport = await model.create({
        data: {
          firefighterName: firefighter.name,
          date: new Date(date),
          addressableSmokeStatus,
          fireAlarmingSystemStatus,
          dieselEnginePumpStatus,
          wetRisersStatus,
          hoseReelCabinetsStatus,
          externalHydrantsStatus,
          waterStorageTanksStatus,
          emergencyLightsStatus,
          remarks,
        },
      });

      res.status(201).json(newReport);
    } catch (error) {
      console.error('Error adding report:', error);
      res.status(500).json({ error: 'Failed to add report' });
    }
  }
}
