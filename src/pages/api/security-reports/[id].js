import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Fetch a single report with observedBy and supervisor names
      const report = await prisma.securityreport.findUnique({
        where: { id: parseInt(id) },
      });

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Fetch names for observedBy and supervisor
      const [observedByUser, supervisorUser] = await Promise.all([
        prisma.user.findUnique({
          where: { id: report.observedBy },
          select: { name: true },
        }),
        prisma.user.findUnique({
          where: { id: report.supervisor },
          select: { name: true },
        }),
      ]);

      return res.status(200).json({
        ...report,
        observedByName: observedByUser?.name || 'Unknown',
        supervisorName: supervisorUser?.name || 'Unknown',
      });
    }

    if (req.method === 'PUT') {
      const {
        date,
        observedBy,
        supervisor,
        description,
        action,
        timeNoted,
        timeSolved,
      } = req.body;
    
      // Validate required fields
      if (!date || !observedBy || !supervisor || !description || !action || !timeNoted) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    
      // Parse dates and ensure they are valid
      const parsedDate = new Date(date);
      const parsedTimeNoted = new Date(timeNoted);
      const parsedTimeSolved = timeSolved ? new Date(timeSolved) : null;
    
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      if (isNaN(parsedTimeNoted.getTime())) {
        return res.status(400).json({ error: 'Invalid timeNoted format' });
      }
      if (parsedTimeSolved && isNaN(parsedTimeSolved.getTime())) {
        return res.status(400).json({ error: 'Invalid timeSolved format' });
      }
    
      try {
        // Update the report
        const updatedReport = await prisma.securityreport.update({
          where: { id: parseInt(id) },
          data: {
            date: parsedDate,
            observedBy: parseInt(observedBy),
            supervisor: parseInt(supervisor),
            description,
            action,
            timeNoted: parsedTimeNoted,
            timeSolved: parsedTimeSolved,
          },
        });
    
        return res.status(200).json(updatedReport);
      } catch (error) {
        console.error('Error updating report:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    

    if (req.method === 'DELETE') {
      // Delete a report
      await prisma.securityreport.delete({
        where: { id: parseInt(id) },
      });

      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error in API handler:', error);

    // Return meaningful Prisma-specific errors
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
