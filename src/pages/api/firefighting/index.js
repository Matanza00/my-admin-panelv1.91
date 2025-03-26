import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient(); // Make sure Prisma Client is properly initialized

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {
      page = 1,
      firefighterName = '',
      dateFrom = '',
      dateTo = '',
      type = 'firefighter',
    } = req.query;
  
    const session = await getSession({ req }); // Get user session
    const user = session?.user;
    const normalizedRole = user?.role?.toLowerCase();
    const userId = parseInt(user?.id); // Assuming user.id is numeric
  
    const model = type === 'firefightingalarm' ? prisma.fireFightingAlarm : prisma.fireFighting;
  
    try {
      const filters = [];
  
      // ✅ If technician, restrict by createdById
      if (normalizedRole === 'technician') {
        filters.push({ createdById: userId });
      } else if (firefighterName) {
        // ✅ For admin/supervisor, allow search by name
        filters.push({
          firefighterName: { contains: firefighterName, mode: 'insensitive' },
        });
      }
  
      if (dateFrom) filters.push({ date: { gte: new Date(dateFrom) } });
      if (dateTo) filters.push({ date: { lte: new Date(dateTo) } });
  
      const whereClause = {
        AND: filters,
        deletedAt: null, // soft-delete protection
      };
  
      const data = await model.findMany({
        where: whereClause,
        skip: (page - 1) * 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
  
      const totalReports = await model.count({ where: whereClause });
      const nextPage = totalReports > page * 10;
  
      res.status(200).json({ data, nextPage });
    } catch (error) {
      console.error('❌ Error fetching firefighting data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
   else if (req.method === 'POST') {
    try {
      const {
        type = 'firefighter',
        firefighterId,
        createdById,
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

      console.log('🚀 Received Payload:', req.body);

      if (!['firefighter', 'firefightingalarm'].includes(type)) {
        console.error('❌ Invalid type:', type);
        return res.status(400).json({ error: 'Invalid type' });
      }

      if (!date || isNaN(new Date(date).getTime())) {
        console.error('❌ Invalid date:', date);
        return res.status(400).json({ error: 'Valid date is required.' });
      }

      const creatorId = parseInt(createdById, 10);
      if (isNaN(creatorId)) {
        console.error('❌ Invalid createdById:', createdById);
        return res.status(400).json({ error: 'Valid createdById is required.' });
      }

      let firefighter = null;

      if (firefighterId) {
        const firefighterInt = parseInt(firefighterId, 10);
        if (isNaN(firefighterInt)) {
          console.error('❌ Invalid firefighter ID:', firefighterId);
          return res.status(400).json({ error: 'Firefighter ID must be a valid number.' });
        }

        firefighter = await prisma.user.findUnique({
          where: { id: firefighterInt },
          select: { id: true, name: true },
        });

        if (!firefighter) {
          console.error('❌ Firefighter not found:', firefighterId);
          return res.status(400).json({ error: 'Invalid firefighter ID.' });
        }
      } else {
        return res.status(400).json({ error: 'Firefighter ID is required.' });
      }

      let model = type === 'firefighter' ? prisma.fireFighting : prisma.fireFightingAlarm;

      console.log('✅ Selected model:', model?.name || 'Model is undefined!');

      if (!model || typeof model.create !== 'function') {
        console.error('❌ Prisma model does not have a create method:', model);
        return res.status(500).json({ error: 'Invalid Prisma model' });
      }

      const dataToInsert = {
        firefighterName: firefighter.name,
        date: new Date(date),
        remarks: remarks || '',
        createdById: creatorId,
      };

      if (type === 'firefighter') {
        dataToInsert.addressableSmokeStatus = Boolean(addressableSmokeStatus);
        dataToInsert.fireAlarmingSystemStatus = Boolean(fireAlarmingSystemStatus);
      } else if (type === 'firefightingalarm') {
        dataToInsert.dieselEnginePumpStatus = Boolean(dieselEnginePumpStatus);
        dataToInsert.wetRisersStatus = Boolean(wetRisersStatus);
        dataToInsert.hoseReelCabinetsStatus = Boolean(hoseReelCabinetsStatus);
        dataToInsert.externalHydrantsStatus = Boolean(externalHydrantsStatus);
        dataToInsert.waterStorageTanksStatus = Boolean(waterStorageTanksStatus);
        dataToInsert.emergencyLightsStatus = Boolean(emergencyLightsStatus);
      }

      console.log('✅ Data to insert:', dataToInsert);

      try {
        const newReport = await model.create({
          data: dataToInsert,
        });

        console.log('✅ Report successfully added:', newReport);
        res.status(201).json(newReport);
      } catch (prismaError) {
        console.error('❌ Prisma Create Error:', prismaError);
        res.status(500).json({ error: 'Failed to create report', details: prismaError.message });
      }
    } catch (error) {
      console.error('🔥 Error adding report:', error);
      res.status(500).json({ error: 'Failed to add report' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

}

