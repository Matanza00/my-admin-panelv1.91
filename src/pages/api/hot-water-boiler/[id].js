import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    // Fetch boiler and associated TimeHr entries (GET request)
    if (method === 'GET') {
      const boiler = await prisma.hotWaterBoiler.findUnique({
        where: { id: parseInt(id) },
        include: { TimeHr: true }, // Include TimeHr entries
      });

      if (!boiler) {
        return res.status(404).json({ error: 'Hot Water Boiler not found' });
      }

      // Fetch operator and supervisor names (assuming a `User` table)
      let operatorName = 'Unknown';
      if (boiler.OperatorName && !isNaN(boiler.OperatorName)) {
        const operator = await prisma.user.findUnique({
          where: { id: parseInt(boiler.OperatorName) },
          select: { name: true },
        });
        operatorName = operator?.name || 'Unknown';
      }

      let supervisorName = 'Unknown';
      if (boiler.SupervisorName && !isNaN(boiler.SupervisorName)) {
        const supervisor = await prisma.user.findUnique({
          where: { id: parseInt(boiler.SupervisorName) },
          select: { name: true },
        });
        supervisorName = supervisor?.name || 'Unknown';
      }

      // Construct the response
      const response = {
        ...boiler,
        OperatorName: operatorName,
        SupervisorName: supervisorName,
        TimeHr: boiler.TimeHr.map((entry) => ({
          ...entry,
          time: entry.time.toISOString(),
        })),
      };

      return res.status(200).json(response);
    }

    // Handle update of boiler and associated TimeHr entries (PUT request)
    if (method === 'PUT') {
      const {
        StartTime,
        ShutdownTime,
        Remarks,
        OperatorName,
        SupervisorName,
        TimeHr,
      } = req.body;

      // Validate required fields
      if (
        !StartTime ||
        !ShutdownTime ||
        !Remarks ||
        !OperatorName ||
        !SupervisorName ||
        !Array.isArray(TimeHr)
      ) {
        return res.status(400).json({ error: 'Invalid payload, all fields are required' });
      }

      // Validate date formats
      const formattedStartTime = new Date(StartTime);
      const formattedShutdownTime = new Date(ShutdownTime);

      if (isNaN(formattedStartTime.getTime()) || isNaN(formattedShutdownTime.getTime())) {
        return res.status(400).json({ error: 'Invalid date format for StartTime or ShutdownTime' });
      }

      // Update the HotWaterBoiler record
      const updatedBoiler = await prisma.hotWaterBoiler.update({
        where: { id: Number(id) },
        data: {
          StartTime: formattedStartTime,
          ShutdownTime: formattedShutdownTime,
          Remarks,
          OperatorName: OperatorName.toString(), // Store as string
          SupervisorName: SupervisorName.toString(), // Store as string
        },
      });

      // Manage TimeHr entries
      // First, delete existing TimeHr entries for the given boiler
      await prisma.timeHour.deleteMany({
        where: { boilerId: Number(id) },
      });

      // Validate and sanitize TimeHr entries
      if (TimeHr.length > 0) {
        const timeHrEntries = TimeHr.map((entry) => {
         
        const [hours, minutes] = entry.time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error(`Invalid time for chiller entry: ${entry.time}`);
        }

        const entryTime = new Date();
        entryTime.setHours(hours, minutes, 0, 0);

          return {
            boilerId: Number(id),
            time: entryTime,
            HotWaterIn: isNaN(parseFloat(entry.HotWaterIn)) ? 0 : parseFloat(entry.HotWaterIn),
            HotWaterOut: isNaN(parseFloat(entry.HotWaterOut)) ? 0 : parseFloat(entry.HotWaterOut),
            ExhaustTemp: isNaN(parseFloat(entry.ExhaustTemp)) ? 0 : parseFloat(entry.ExhaustTemp),
            FurnacePressure: isNaN(parseFloat(entry.FurnacePressure)) ? 0 : parseFloat(entry.FurnacePressure),
            assistantSupervisor: entry.assistantSupervisor || '',
          };
        });

        await prisma.timeHour.createMany({
          data: timeHrEntries,
        });
      }

      return res.status(200).json(updatedBoiler);
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error in API:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
}
