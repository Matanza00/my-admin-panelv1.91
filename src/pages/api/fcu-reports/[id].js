import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma client

export default async function handler(req, res) {
  const { method, body } = req;
  const { id } = req.query;

  console.log('Request received for FCU report ID:', id);
  console.log('Request method:', method);
  console.log('Request Body:', body);

  try {
    // Parse ID and validate
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      console.error('Invalid ID format:', id);
      return res.status(400).json({ error: 'Invalid report ID' });
    }

    if (method === 'GET') {
      // Fetch the report
      const report = await prisma.fCUReport.findUnique({
        where: { id: parsedId },
        include: { floorFCs: true },
      });

      if (!report) {
        console.warn('No report found for ID:', parsedId);
        return res.status(404).json({ error: 'FCU report not found' });
      }

      console.log('Fetched report:', report);
      return res.status(200).json(report);
    } else if (method === 'PUT') {
      const { date, remarks, supervisorApproval, engineerApproval, floorFCs } = body;

      try {
        // Validate inputs
        const parsedSupervisorApproval = supervisorApproval === true || supervisorApproval === 'true';
        const parsedEngineerApproval = engineerApproval === true || engineerApproval === 'true';

        const validatedFloorFCs = floorFCs.map((floorFC) => {
          if (!floorFC.floorFrom || !floorFC.floorTo) {
            throw new Error('Invalid data: floorFrom and floorTo cannot be empty.');
          }

          return {
            floorFrom: floorFC.floorFrom,
            floorTo: floorFC.floorTo,
            details: floorFC.details || '',
            verifiedBy: floorFC.verifiedBy || null,
            attendedBy: floorFC.attendedBy || null,
          };
        });

        // Update FCU report
        const updatedReport = await prisma.fCUReport.update({
          where: { id: parsedId },
          data: {
            date,
            remarks,
            supervisorApproval: parsedSupervisorApproval,
            engineerApproval: parsedEngineerApproval,
            floorFCs: {
              deleteMany: {}, // Clear existing floorFCs
              create: validatedFloorFCs,
            },
          },
        });

        console.log('Updated report:', updatedReport);
        return res.status(200).json(updatedReport);
      } catch (error) {
        console.error('Error updating report:', error.message);
        return res.status(400).json({ error: error.message });
      }
    } else {
      console.warn('Method Not Allowed:', method);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Unexpected error in API handler:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
