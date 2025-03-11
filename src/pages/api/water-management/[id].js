import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    // Fetch Water Management with Pumps and their associated Checks
    case 'GET':
      try {
        const waterManagement = await prisma.waterManagement.findUnique({
          where: { id: Number(id) },
          include: {
            pumps: {
              include: {
                checks: true,
              },
            },
          },
        });

        if (!waterManagement) {
          return res.status(404).json({ error: 'Water Management not found' });
        }

        res.status(200).json(waterManagement);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching water management data' });
      }
      break;

    // Update Water Management Data, including Pumps and their Checks
    case 'PUT':
      try {
        const { title, description, supervisorName, operatorName, engineerName, pumps } = req.body;

        // Format and sanitize input
        const formattedPumps = pumps.map((pump) => {
          return {
            ...pump,
            // Ensure capacity is a number
            capacity: parseFloat(pump.capacity), // Convert to number
            // Ensure checks array is correctly formatted
            checks: pump.checks.map((check) => ({
              ...check,
              // Sanitize and ensure that check fields are strings
              waterSealStatus: String(check.waterSealStatus),
              pumpBearingStatus: String(check.pumpBearingStatus),
              motorBearingStatus: String(check.motorBearingStatus),
              rubberCouplingStatus: String(check.rubberCouplingStatus),
              pumpImpellerStatus: String(check.pumpImpellerStatus),
              mainValvesStatus: String(check.mainValvesStatus),
              motorWindingStatus: String(check.motorWindingStatus),
            })),
          };
        });

        const updatedWaterManagement = await prisma.waterManagement.update({
          where: { id: Number(id) },
          data: {
            title,
            description,
            supervisorName,
            operatorName,
            engineerName,
            pumps: {
              upsert: formattedPumps.map((pump) => ({
                where: { id: pump.id || 0 }, // Check if ID exists, else create
                create: {
                  name: pump.name,
                  capacity: pump.capacity,
                  location: pump.location,
                  checks: {
                    create: pump.checks.map((check) => ({
                      waterSealStatus: check.waterSealStatus,
                      pumpBearingStatus: check.pumpBearingStatus,
                      motorBearingStatus: check.motorBearingStatus,
                      rubberCouplingStatus: check.rubberCouplingStatus,
                      pumpImpellerStatus: check.pumpImpellerStatus,
                      mainValvesStatus: check.mainValvesStatus,
                      motorWindingStatus: check.motorWindingStatus,
                    })),
                  },
                },
                update: {
                  name: pump.name,
                  capacity: pump.capacity,
                  location: pump.location,
                  checks: {
                    upsert: pump.checks.map((check) => ({
                      where: { id: check.id || 0 }, // Ensure ID exists
                      create: {
                        waterSealStatus: check.waterSealStatus,
                        pumpBearingStatus: check.pumpBearingStatus,
                        motorBearingStatus: check.motorBearingStatus,
                        rubberCouplingStatus: check.rubberCouplingStatus,
                        pumpImpellerStatus: check.pumpImpellerStatus,
                        mainValvesStatus: check.mainValvesStatus,
                        motorWindingStatus: check.motorWindingStatus,
                      },
                      update: {
                        waterSealStatus: check.waterSealStatus,
                        pumpBearingStatus: check.pumpBearingStatus,
                        motorBearingStatus: check.motorBearingStatus,
                        rubberCouplingStatus: check.rubberCouplingStatus,
                        pumpImpellerStatus: check.pumpImpellerStatus,
                        mainValvesStatus: check.mainValvesStatus,
                        motorWindingStatus: check.motorWindingStatus,
                      },
                    })),
                  },
                },
              })),
            },
          },
        });

        res.status(200).json(updatedWaterManagement);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating water management data' });
      }
      break;

    // Delete a Pump and its Checks from the Water Management
    case 'DELETE':
      const { pumpId } = req.body;

      if (!pumpId) {
        return res.status(400).json({ error: 'Pump ID is required for deletion' });
      }

      try {
        const deletedPump = await prisma.$transaction(async (prisma) => {
          // Delete associated pump checks first (if required)
          await prisma.pumpCheck.deleteMany({
            where: { pumpId },
          });

          // Now delete the pump itself
          return await prisma.pump.delete({
            where: { id: pumpId },
          });
        });

        res.status(200).json({ message: 'Pump deleted successfully', deletedPump });
      } catch (error) {
        console.error('Error deleting pump:', error);
        res.status(500).json({ error: 'Error deleting pump' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
      break;
  }
}
