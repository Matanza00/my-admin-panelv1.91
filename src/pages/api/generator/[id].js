import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // Validate ID
  if (typeof id !== 'string' || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const generatorId = parseInt(id);

  switch (method) {
    case 'GET':
      try {
        // Fetch the generator details
        const generator = await prisma.generator.findUnique({
          where: { id: generatorId },
          include: {
            generatorFuel: true, // Include related generator fuel data
          },
        });

        if (!generator) {
          return res.status(404).json({ error: 'Generator not found' });
        }

        // Parse and validate electrician and engineer IDs
        const electricianId = parseInt(generator.electricianName, 10);
        const engineerId = parseInt(generator.engineerName, 10);

        // Fetch electrician and engineer names if IDs are valid
        const [electrician, engineer] = await Promise.all([
          electricianId
            ? prisma.user.findUnique({
                where: { id: electricianId },
                select: { name: true },
              })
            : null,
          engineerId
            ? prisma.user.findUnique({
                where: { id: engineerId },
                select: { name: true },
              })
            : null,
        ]);

        // Return the generator details with user names
        return res.status(200).json({
          ...generator,
          electricianName: electrician?.name || 'Unknown',
          engineerName: engineer?.name || 'Unknown',
        });
      } catch (error) {
        console.error('Error fetching generator:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }


    case 'PUT':
      try {
        const { generatorFuel, electricianId, engineerId, ...updatedGeneratorData } = req.body;

        if (!electricianId || !engineerId) {
          return res.status(400).json({ error: 'Electrician and Engineer IDs are required' });
        }

        // Format the generator data
        const formattedGeneratorData = {
          ...updatedGeneratorData,
          electricianName: electricianId.toString(), // Save the ID as a string
          engineerName: engineerId.toString(), // Save the ID as a string
          date: updatedGeneratorData.date ? new Date(updatedGeneratorData.date) : new Date(),
          currDate: updatedGeneratorData.currDate ? new Date(updatedGeneratorData.currDate) : new Date(),
          lastDate: updatedGeneratorData.lastDate ? new Date(updatedGeneratorData.lastDate) : null,
          engOil: updatedGeneratorData.engOil ?? false,
          fuelFilter: updatedGeneratorData.fuelFilter ?? false,
          airFilter: updatedGeneratorData.airFilter ?? false,
          currHrs: parseInt(updatedGeneratorData.currHrs) || 0,
          capacity: parseInt(updatedGeneratorData.capacity) || 0,
          lastHrs: parseInt(updatedGeneratorData.lastHrs) || 0,
        };

        // Update the generator record
        const updatedGenerator = await prisma.generator.update({
          where: { id: generatorId },
          data: formattedGeneratorData,
        });

        // Handle fuel records
        if (generatorFuel !== undefined) {
          if (generatorFuel.length === 0) {
            await prisma.generatorFuel.deleteMany({
              where: { generatorId },
            });
          } else {
            const existingFuelDetails = await prisma.generatorFuel.findMany({
              where: { generatorId },
            });

            const fuelIdsInRequest = generatorFuel.map((fuel) => fuel.id);

            // Delete fuel records not included in the request
            const fuelToDelete = existingFuelDetails.filter(
              (fuel) => !fuelIdsInRequest.includes(fuel.id)
            );

            if (fuelToDelete.length > 0) {
              await prisma.generatorFuel.deleteMany({
                where: {
                  id: { in: fuelToDelete.map((fuel) => fuel.id) },
                },
              });
            }

            // Update or create fuel records
            for (const fuel of generatorFuel) {
              if (fuel.id) {
                await prisma.generatorFuel.update({
                  where: { id: fuel.id },
                  data: {
                    fuelLast: fuel.fuelLast,
                    fuelConsumed: fuel.fuelConsumed,
                    fuelReceived: fuel.fuelReceived,
                    available: fuel.available,
                  },
                });
              } else {
                await prisma.generatorFuel.create({
                  data: {
                    generatorId,
                    fuelLast: fuel.fuelLast,
                    fuelConsumed: fuel.fuelConsumed,
                    fuelReceived: fuel.fuelReceived,
                    available: fuel.available,
                  },
                });
              }
            }
          }
        }

        return res.status(200).json(updatedGenerator);
      } catch (error) {
        console.error('Error updating generator:', error);
        return res.status(500).json({ error: 'Error updating generator' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
