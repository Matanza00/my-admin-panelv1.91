import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id, type } = req.query;
  const parsedId = Number(id);

  // Validate ID
  if (!parsedId || Number.isNaN(parsedId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Ensure correct model selection
  const model =
    type === 'firefighter' ? prisma.fireFighting :
    type === 'firefightingalarm' ? prisma.fireFightingAlarm :
    null;

  if (!model) {
    return res.status(400).json({ error: 'Invalid type. Use firefighter or firefightingalarm' });
  }

  try {
    if (req.method === 'GET') {
      console.log(`🔍 Fetching record ID: ${parsedId}, Type: ${type}`);

      // Fetch the record
      const record = await model.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          date: true,
          firefighterName: true,
          remarks: true,
          deletedAt: true,
          ...(type === 'firefighter'
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

      return res.status(200).json(record);
    }

    else if (req.method === 'PUT') {
      console.log(`✏️ Updating record ID: ${parsedId}, Type: ${type}`);

      const requestBody = req.body;
      if (!requestBody || Object.keys(requestBody).length === 0) {
        return res.status(400).json({ error: 'No data provided for update' });
      }

      // Check if record exists
      const existingRecord = await model.findUnique({ where: { id: parsedId } });
      if (!existingRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }

      // Update the record
      const updatedRecord = await model.update({
        where: { id: parsedId },
        data: {
          firefighterName: requestBody.firefighterName || existingRecord.firefighterName,
          remarks: requestBody.remarks || existingRecord.remarks,
          updatedAt: new Date(),
          ...(type === 'firefighter' ? {
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
        },
      });

      return res.status(200).json(updatedRecord);
    }

    else if (req.method === 'DELETE') {
      console.log(`🗑️ Deleting record ID: ${parsedId}, Type: ${type}`);

      // Soft delete by setting `deletedAt`
      await model.update({
        where: { id: parsedId },
        data: { deletedAt: new Date() },
      });

      return res.status(200).json({ message: 'Record deleted successfully' });
    }

    else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(`❌ Error processing ${req.method} request:`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
