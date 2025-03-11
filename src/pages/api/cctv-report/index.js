import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * parseInt(limit, 10);

      const reports = await prisma.cCTVReport.findMany({
        skip,
        take: parseInt(limit, 10),
        include: {
          camera: true, // Include related cameras
        },
        orderBy: {
          date: 'desc',
        },
      });

      const totalCount = await prisma.cCTVReport.count();
      const totalPages = Math.ceil(totalCount / parseInt(limit, 10));
      const nextPage = skip + parseInt(limit, 10) < totalCount;

      // Fetch CCTV Operator names
      const formattedReports = await Promise.all(
        reports.map(async (report) => {
          const operator = await prisma.user.findUnique({
            where: { id: report.cctvOperator },
            select: { name: true },
          });

          return {
            ...report,
            date: report.date.toISOString().split('T')[0],
            time: report.time.toISOString().slice(11, 16),
            cctvOperatorName: operator ? operator.name : 'Unknown',
            cameraCount: report.camera.length, // Add camera count to each report
          };
        })
      );

      return res.status(200).json({ data: formattedReports, nextPage, totalPages });
    } catch (error) {
      console.error('Error fetching CCTV reports:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { date, time, remarks, operationalReport, cctvOperator, cameras, createdById } = req.body;

      // Validate required fields
      if (!date || !time || operationalReport === undefined || !cctvOperator || !Array.isArray(cameras) || !createdById) {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
      }

      // Validate the CCTV operator
      const operatorExists = await prisma.user.findUnique({
        where: { id: parseInt(cctvOperator, 10) },
      });

      if (!operatorExists) {
        return res.status(400).json({ error: 'Invalid CCTV Operator ID.' });
      }

      // Validate and map camera entries
      const cameraData = cameras.map((camera) => {
        if (!camera.cameraName || !camera.cameraNo || !camera.cameraLocation) {
          throw new Error('Each camera must have a name, number, and location.');
        }

        return {
          cameraName: camera.cameraName,
          cameraNo: camera.cameraNo,
          cameraLocation: camera.cameraLocation,
        };
      });

      // Create the CCTV report along with its cameras
      const newReport = await prisma.cCTVReport.create({
        data: {
          date: new Date(date),
          time: new Date(`${date}T${time}`),
          remarks: remarks || null,
          operationalReport: Boolean(operationalReport),
          cctvOperator: parseInt(cctvOperator, 10), // Store user ID
          camera: {
            create: cameraData,
          },
        },
        include: {
          camera: true,
        },
      });

      // Notify Managers
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: 'Manager', // Adjust to your role structure
          },
        },
        select: { id: true, name: true },
      });

      const creator = await prisma.user.findUnique({
        where: { id: parseInt(createdById, 10) },
        select: { name: true },
      });

      if (!creator) {
        throw new Error('Invalid createdById');
      }

      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Adjust to the appropriate template ID
            userId: manager.id,
            createdById: parseInt(createdById, 10),
            altText: `A new CCTV report has been created by ${creator.name}.`,
            link: `/security-services/cctv-report/view/${newReport.id}`, // Adjust URL as needed
            isRead: false,
            sentAt: new Date(),
          },
        })
      );

      await Promise.all(notificationPromises);

      // Fetch operator name for response
      const operator = await prisma.user.findUnique({
        where: { id: newReport.cctvOperator },
        select: { name: true },
      });

      const formattedResponse = {
        ...newReport,
        date: newReport.date.toISOString().split('T')[0],
        time: newReport.time.toISOString().slice(11, 16),
        cctvOperatorName: operator ? operator.name : 'Unknown',
        camera: newReport.camera.map((cam) => ({
          ...cam,
          createdAt: cam.createdAt.toISOString(),
          updatedAt: cam.updatedAt.toISOString(),
        })),
      };

      return res.status(201).json(formattedResponse);
    } catch (error) {
      console.error('Error creating CCTV report:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
