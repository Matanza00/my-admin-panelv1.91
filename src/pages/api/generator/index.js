import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        const { page = 1, genSetNo, electricianName, engineerName, date } = query;

        const filters = {};
        if (genSetNo) filters.genSetNo = { contains: genSetNo, mode: "insensitive" };
        if (electricianName) filters.electricianName = { contains: electricianName, mode: "insensitive" };
        if (engineerName) filters.engineerName = { contains: engineerName, mode: "insensitive" };
        if (date) filters.currDate = { equals: new Date(date) };

        // Fetch generators with pagination
        const generators = await prisma.generator.findMany({
          where: filters,
          skip: (page - 1) * 10,
          take: 10,
          select: {
            id: true,
            date: true,
            genSetNo: true,
            power: true,
            capacity: true,
            currHrs: true,
            currDate: true,
            lastHrs: true,
            lastDate: true,
            electricianName: true,
            engineerName: true,
          },
        });

        // Fetch electrician and engineer names for each generator
        const enrichedGenerators = await Promise.all(
          generators.map(async (generator) => {
            const electricianId = parseInt(generator.electricianName, 10);
            const engineerId = parseInt(generator.engineerName, 10);
        
            const [electrician, engineer] = await Promise.all([
              electricianId
                ? prisma.user.findUnique({
                    where: { id: electricianId },
                    select: { name: true },
                  })
                : Promise.resolve(null), // Fallback if parsing fails
        
              engineerId
                ? prisma.user.findUnique({
                    where: { id: engineerId },
                    select: { name: true },
                  })
                : Promise.resolve(null), // Fallback if parsing fails
            ]);
        
            return {
              ...generator,
              electricianName: electrician?.name || "Unknown", // Fallback to "Unknown" if user is not found
              engineerName: engineer?.name || "Unknown", // Fallback to "Unknown" if user is not found
            };
          })
        );
        

        // Total count for pagination
        const totalGenerators = await prisma.generator.count({ where: filters });
        const hasMore = totalGenerators > page * 10;

        res.status(200).json({
          data: enrichedGenerators,
          nextPage: hasMore ? page + 1 : null,
        });
      } catch (error) {
        console.error("Error fetching generators:", error);
        res.status(500).json({ error: "Failed to fetch generators" });
      }
      break;

      case "POST":
        try {
          const { generatorFuel, electricianId, engineerId, createdById, ...generatorData } = req.body;
      
          const formattedGeneratorData = {
            ...generatorData,
            electricianName: electricianId.toString(), // Save electrician ID as a string
            engineerName: engineerId.toString(), // Save engineer ID as a string
            date: new Date(),
            currDate: new Date(generatorData.currDate),
            lastDate: generatorData.lastDate ? new Date(generatorData.lastDate) : new Date(), // Provide a default value for lastDate
            currHrs: parseInt(generatorData.currHrs, 10),
            capacity: parseInt(generatorData.capacity, 10),
            lastHrs: parseInt(generatorData.lastHrs || 0, 10), // Use the provided last hours or default to 0
          };
      
          // Create the new generator record
          const newGenerator = await prisma.generator.create({
            data: formattedGeneratorData,
          });
      
          // Handle fuel details if provided
          if (generatorFuel && generatorFuel.length > 0) {
            await prisma.generatorFuel.createMany({
              data: generatorFuel.map((fuel) => ({
                generatorId: newGenerator.id,
                fuelLast: fuel.fuelLast,
                fuelConsumed: fuel.fuelConsumed,
                fuelReceived: fuel.fuelReceived,
                available: fuel.available,
              })),
            });
          }
      
          // Fetch the creator's name
          const creator = await prisma.user.findUnique({
            where: { id: parseInt(createdById, 10) },
          });
      
          if (!creator) {
            return res.status(400).json({ error: "Invalid creator ID" });
          }
      
          // Notify Managers
          const managers = await prisma.user.findMany({
            where: {
              role: {
                name: "Manager", // Adjust this to your Role schema
              },
            },
            select: { id: true, name: true },
          });
      
          const notificationPromises = managers.map((manager) =>
            prisma.notification.create({
              data: {
                templateId: 2, // Adjust to the appropriate template ID for generators
                userId: manager.id,
                createdById: parseInt(createdById, 10), // ID of the user who created the report
                altText: `A new generator record has been added by ${creator.name}.`,
                link: `/daily-maintenance/generator/view/${newGenerator.id}`, // Update URL as needed
                isRead: false,
                sentAt: new Date(),
              },
            })
          );
      
          await Promise.all(notificationPromises);
      
          return res.status(201).json(newGenerator);
        } catch (error) {
          console.error("Error creating generator:", error);
          res.status(500).json({ error: "Error creating generator" });
        }
      
    case "DELETE":
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Generator ID is required" });
      }

      try {
        const generator = await prisma.generator.update({
          where: { id: parseInt(id) },
          data: { remove: true }, // Assuming a 'remove' field exists for soft deletion
        });

        res.status(200).json(generator);
      } catch (error) {
        console.error("Error deleting generator:", error);
        res.status(500).json({ error: "Failed to delete generator" });
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}
