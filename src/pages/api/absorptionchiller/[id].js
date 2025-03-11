import { PrismaClient, Prisma } from '@prisma/client'; // Include Prisma namespace

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, body } = req;
  const { id } = req.query;

  try {
    if (method === 'GET') {
      try {
        // Fetch AbsorptionChiller data
        const boiler = await prisma.absorbtionChiller.findUnique({
          where: { id: parseInt(id) },
          include: { Chillers: true }, // Include related chillers
        });
    
        if (!boiler) {
          return res.status(404).json({ error: 'Absorption Chiller not found' });
        }
    
        // Resolve operator name if stored as an ID
        let operatorName = boiler.OperatorName;
        if (!isNaN(Number(boiler.OperatorName))) {
          const operator = await prisma.user.findUnique({
            where: { id: parseInt(boiler.OperatorName) },
            select: { name: true },
          });
          operatorName = operator?.name || 'Unknown';
        }
    
        // Resolve supervisor name if stored as an ID
        let supervisorName = boiler.SupervisorName;
        if (!isNaN(Number(boiler.SupervisorName))) {
          const supervisor = await prisma.user.findUnique({
            where: { id: parseInt(boiler.SupervisorName) },
            select: { name: true },
          });
          supervisorName = supervisor?.name || 'Unknown';
        }
    
        // Construct the response with resolved names
        const response = {
          ...boiler,
          OperatorName: operatorName,
          SupervisorName: supervisorName,
        };
    
        return res.status(200).json(response);
      } catch (error) {
        console.error('Error in GET API:', error);
        return res.status(500).json({ error: 'Server Error' });
      }
    }
    
    

    if (method === 'PUT') {
      const { StartTime, ShutdownTime, Remarks, OperatorName, SupervisorName, Chillers } = body;

      // Validate inputs
      if (
        !StartTime ||
        !ShutdownTime ||
        !Remarks ||
        !OperatorName ||
        !SupervisorName ||
        !Array.isArray(Chillers)
      ) {
        return res.status(400).json({ error: 'Invalid payload, all fields are required' });
      }

      const formattedStartTime = new Date(StartTime);
      const formattedShutdownTime = new Date(ShutdownTime);

      if (isNaN(formattedStartTime) || isNaN(formattedShutdownTime)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      // Update the AbsorptionChiller data
      const updatedBoiler = await prisma.absorbtionChiller.update({
        where: { id: Number(id) },
        data: {
          StartTime: formattedStartTime,
          ShutdownTime: formattedShutdownTime,
          Remarks,
          OperatorName,
          SupervisorName,
        },
      });

      // Prepare Chillers data
      const chillerData = Chillers.map((entry) => {
        const [hours, minutes] = entry.time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error(`Invalid time for chiller entry: ${entry.time}`);
        }

        const entryTime = new Date();
        entryTime.setHours(hours, minutes, 0, 0);

        return {
          chillerId: Number(id),
          time: entryTime,
          ColdWaterIn: parseFloat(entry.ColdWaterIn) || 0,
          ColdWaterOut: parseFloat(entry.ColdWaterOut) || 0,
          ChillingWaterIn: parseFloat(entry.ChillingWaterIn) || 0,
          ChillingWaterOut: parseFloat(entry.ChillingWaterOut) || 0,
          HeatIn:  parseFloat(entry.HeatIn) || 0,
          HeatOut:  parseFloat(entry.HeatOut) || 0,
          assistantSupervisor: entry.assistantSupervisor || '',
        };
      });

      // Delete existing Chillers
      await prisma.chiller.deleteMany({
        where: { chillerId: Number(id) },
      });

      // Insert new Chillers
      if (Chillers.length > 0) {
        await prisma.chiller.createMany({ data: chillerData });
      }

      return res.status(200).json(updatedBoiler);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error in API:', error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: 'Validation Error', details: error.message });
    }
    return res.status(500).json({ error: 'Server Error' });
  }
}
