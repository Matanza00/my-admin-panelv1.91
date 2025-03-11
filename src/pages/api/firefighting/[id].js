import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  // Ensure the id is valid and is a number
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch the firefighting record by ID
      const firefighting = await prisma.fireFighting.findUnique({
        where: { id: parseInt(id) }, // Ensure the id is parsed as an integer
      });

      if (!firefighting) {
        return res.status(404).json({ error: 'Record not found' });
      }

      // Optionally fetch firefighter data
      const firefighter = await prisma.user.findFirst({
        where: { name: firefighting.firefighterName },
        select: { id: true, name: true },
      });

      // Return the firefighting record along with firefighter info
      res.status(200).json({
        ...firefighting,
        firefighterId: firefighter?.id || null,
      });
    } catch (error) {
      console.error('Error fetching record:', error);
      res.status(500).json({ error: 'Failed to fetch record' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        firefighterId, // This comes from the frontend
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
  
      // Validate required fields
      if (!firefighterId) {
        return res.status(400).json({ error: 'Firefighter ID is required' });
      }
  
      // Fetch the firefighter name based on the provided firefighterId
      const firefighter = await prisma.user.findUnique({
        where: { id: parseInt(firefighterId, 10) },
        select: { name: true },
      });
  
      if (!firefighter) {
        return res.status(400).json({ error: 'Invalid Firefighter ID' });
      }
  
      // Update the record
      const updatedRecord = await prisma.fireFighting.update({
        where: { id: parseInt(id) },
        data: {
          firefighterName: firefighter.name, // Update the firefighterName
          addressableSmokeStatus: Boolean(addressableSmokeStatus),
          fireAlarmingSystemStatus: Boolean(fireAlarmingSystemStatus),
          dieselEnginePumpStatus: Boolean(dieselEnginePumpStatus),
          fireextinguisherStatus: Boolean(fireextinguisherStatus),
          wetRisersStatus: Boolean(wetRisersStatus),
          hoseReelCabinetsStatus: Boolean(hoseReelCabinetsStatus),
          externalHydrantsStatus: Boolean(externalHydrantsStatus),
          waterStorageTanksStatus: Boolean(waterStorageTanksStatus),
          emergencyLightsStatus: Boolean(emergencyLightsStatus),
          remarks: remarks || '',
        },
      });
  
      return res.status(200).json(updatedRecord);
    } catch (error) {
      console.error('Error updating firefighting record:', error);
      return res.status(500).json({ error: 'Error updating record' });
    }
  }
}