import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id, type = 'fireFighting' } = req.query;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Ensure correct model selection
  const model = type === 'fireFightingAlarm' ? prisma.fireFightingAlarm : prisma.fireFighting;

  if (req.method === 'GET') {
    try {
      // Fetch firefighting record (including firefighterName directly)
      const record = await model.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          date: true,
          firefighterName: true, // Firefighter name is directly stored here
          remarks: true,
          ...(type === 'fireFighting'
            ? {
                addressableSmokeStatus: true,
                fireAlarmingSystemStatus: true,
              }
            : {
                dieselEnginePumpStatus: true,
                wetRisersStatus: true,
                hoseReelCabinetsStatus: true,
                externalHydrantsStatus: true,
                waterStorageTanksStatus: true,
                emergencyLightsStatus: true,
              }),
        },
      });

      if (!record || record.deletedAt) {
        return res.status(404).json({ error: 'Record not found' });
      }

      // Return the response
      res.status(200).json(record);
    } catch (error) {
      console.error('Error fetching record:', error);
      res.status(500).json({ error: 'Failed to fetch record' });
    }
  }  else if (req.method === 'PUT') {
    try {
      const requestBody = req.body;

      // Validate request body
      if (!requestBody || Object.keys(requestBody).length === 0) {
        return res.status(400).json({ error: 'Invalid request: No data provided' });
      }

      // Validate if the record exists before updating
      const existingRecord = await model.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }

      // Update the record
      const updatedRecord = await model.update({
        where: { id: parseInt(id) },
        data: {
          firefighterName: requestBody.firefighterName || existingRecord.firefighterName,
          remarks: requestBody.remarks || existingRecord.remarks,
          ...(type === 'fireFighting' ? {
            addressableSmokeStatus: requestBody.addressableSmokeStatus ?? existingRecord.addressableSmokeStatus,
            fireAlarmingSystemStatus: requestBody.fireAlarmingSystemStatus ?? existingRecord.fireAlarmingSystemStatus,
          } : {
            dieselEnginePumpStatus: requestBody.dieselEnginePumpStatus ?? existingRecord.dieselEnginePumpStatus,
            wetRisersStatus: requestBody.wetRisersStatus ?? existingRecord.wetRisersStatus,
            hoseReelCabinetsStatus: requestBody.hoseReelCabinetsStatus ?? existingRecord.hoseReelCabinetsStatus,
            externalHydrantsStatus: requestBody.externalHydrantsStatus ?? existingRecord.externalHydrantsStatus,
            waterStorageTanksStatus: requestBody.waterStorageTanksStatus ?? existingRecord.waterStorageTanksStatus,
            emergencyLightsStatus: requestBody.emergencyLightsStatus ?? existingRecord.emergencyLightsStatus,
          }),
          updatedAt: new Date(), // Ensure updated timestamp
        },
      });

      return res.status(200).json(updatedRecord);
    } catch (error) {
      console.error('Error updating record:', error);
      return res.status(500).json({ error: 'Error updating record' });
    }
  }  else if (req.method === 'DELETE') {
    try {
      await model.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() }, // Soft delete
      });

      return res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Error deleting record:', error);
      return res.status(500).json({ error: 'Error deleting record' });
    }
  }
}
