import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Fetch report with cameras and operator details
      const report = await prisma.cCTVReport.findUnique({
        where: { id: parseInt(id, 10) },
        include: { camera: true },
      });

      if (!report) {
        return res.status(404).json({ error: 'CCTV Report not found' });
      }

      // Fetch operator's name
      const operator = await prisma.user.findUnique({
        where: { id: report.cctvOperator },
        select: { name: true },
      });

      // Format dates, times, and cameras for response
      const formattedReport = {
        ...report,
        date: report.date.toISOString().split('T')[0],
        time: report.time.toISOString().slice(11, 16),
        cctvOperatorName: operator ? operator.name : 'Unknown', // Add operator name
        camera: report.camera.map((cam) => ({
          cameraType: cam.cameraName.includes('DVR') ? 'DVR' : 'NVR',
          cameraName: cam.cameraName,
          cameraNo: cam.cameraNo,
          cameraLocation: cam.cameraLocation,
          createdAt: cam.createdAt.toISOString(),
          updatedAt: cam.updatedAt.toISOString(),
        })),
      };

      return res.status(200).json(formattedReport);
    }

    if (req.method === 'PUT') {
      const { date, time, remarks, operationalReport, cctvOperator, cameras } = req.body;

      // Validate required fields
      if (!date || !time || operationalReport === undefined || !cctvOperator || !Array.isArray(cameras)) {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
      }

      // Validate cctvOperator ID
      const operatorExists = await prisma.user.findUnique({
        where: { id: parseInt(cctvOperator, 10) },
      });

      if (!operatorExists) {
        return res.status(400).json({ error: 'Invalid CCTV Operator ID.' });
      }

      try {
        // Validate and map camera entries
        const cameraData = cameras.map((cam) => {
          if (!cam.cameraName || !cam.cameraNo || !cam.cameraLocation) {
            throw new Error(`Invalid camera data: ${JSON.stringify(cam)}`);
          }

          return {
            cameraName: cam.cameraName,
            cameraNo: cam.cameraNo,
            cameraLocation: cam.cameraLocation,
          };
        });

        // Update the CCTV report along with its cameras
        const updatedReport = await prisma.cCTVReport.update({
          where: { id: parseInt(id, 10) },
          data: {
            date: new Date(date),
            time: new Date(`${date}T${time}`),
            remarks: remarks || null,
            operationalReport: Boolean(operationalReport),
            cctvOperator: parseInt(cctvOperator, 10), // Store operator ID
            camera: {
              deleteMany: {}, // Delete previous cameras
              create: cameraData, // Add new cameras
            },
          },
          include: { camera: true },
        });

        // Fetch operator's name for the response
        const operator = await prisma.user.findUnique({
          where: { id: updatedReport.cctvOperator },
          select: { name: true },
        });

        const formattedResponse = {
          ...updatedReport,
          date: updatedReport.date.toISOString().split('T')[0],
          time: updatedReport.time.toISOString().slice(11, 16),
          cctvOperatorName: operator ? operator.name : 'Unknown', // Add operator name
          camera: updatedReport.camera.map((cam) => ({
            cameraName: cam.cameraName,
            cameraNo: cam.cameraNo,
            cameraLocation: cam.cameraLocation,
            createdAt: cam.createdAt.toISOString(),
            updatedAt: cam.updatedAt.toISOString(),
          })),
        };

        return res.status(200).json(formattedResponse);
      } catch (error) {
        console.error('Error updating CCTV report:', error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
      }
    }

    if (req.method === 'DELETE') {
      // Delete the CCTV report and associated cameras
      try {
        const deletedReport = await prisma.cCTVReport.delete({
          where: { id: parseInt(id, 10) },
          include: { camera: true }, // Include related cameras in the response
        });

        return res.status(200).json({ message: 'CCTV Report deleted successfully', data: deletedReport });
      } catch (error) {
        console.error('Error deleting CCTV report:', error);
        return res.status(500).json({ error: 'Failed to delete CCTV report' });
      }
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
