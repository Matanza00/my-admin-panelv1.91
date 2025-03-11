import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  // Handle GET request for fetching FCU reports with pagination
  if (method === 'GET') {
    try {
      const { page = 1, floorFrom, floorTo, attendedBy, supervisorApproval } = req.query;
      const pageSize = 10;

      // Build the where filter based on the query parameters
      const where = {
        ...(floorFrom && { floorFCs: { some: { floorFrom: { gte: floorFrom } } } }),
        ...(floorTo && { floorFCs: { some: { floorTo: { lte: floorTo } } } }),
        ...(attendedBy && { floorFCs: { some: { attendedBy: { contains: attendedBy, mode: 'insensitive' } } } }),
        ...(supervisorApproval && { supervisorApproval: supervisorApproval === 'true' }),
      };

      // Fetch FCU reports with related FloorFCs
      const fcuReports = await prisma.fCUReport.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: {
          floorFCs: true, // Include related FloorFC records
        },
      });

      const totalReports = await prisma.fCUReport.count({ where });
      const hasMore = totalReports > page * pageSize;

      res.status(200).json({
        data: fcuReports.length > 0 ? fcuReports : [], // Return empty array if no data
        nextPage: hasMore, // Indicate if there are more pages
      });
    } catch (error) {
      console.error('Error fetching FCU reports:', error);
      res.status(500).json({ error: 'Failed to fetch FCU reports' });
    }
  }

  // Handle POST request for creating a new FCU report with associated FloorFC entries
  else  if (method === 'POST') {
    // Get data from the request body
    try {
      const { remarks, supervisorApproval, engineerApproval, floorFCs, createdById } = req.body;
    
      // Validate `createdById` exists
      if (!createdById) {
        return res.status(400).json({ error: 'createdById is required' });
      }
    
      // Ensure `createdById` is an integer
      const creatorId = parseInt(createdById, 10);
      if (isNaN(creatorId)) {
        return res.status(400).json({ error: 'createdById must be a valid integer' });
      }
    
      // Fetch the username of the creator
      const creator = await prisma.user.findUnique({
        where: { id: creatorId },
        select: { name: true }, // Fetch only the username
      });
    
      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }
    
      // Create a new FCU report in the database
      const newReport = await prisma.fCUReport.create({
        data: {
          date: new Date(),
          remarks,
          supervisorApproval: supervisorApproval === 'true',
          engineerApproval: engineerApproval === 'true',
          floorFCs: {
            create: floorFCs.map((floorFC) => ({
              floorFrom: floorFC.floorFrom,
              floorTo: floorFC.floorTo,
              details: floorFC.details,
              attendedBy: floorFC.attendedBy,
              verifiedBy: floorFC.verifiedBy,
            })),
          },
        },
      });
    
      // Fetch all managers to send notifications
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: 'Manager', // Use appropriate condition based on your schema
          },
        },
      });
    // Construct the report link
    const reportLink = `/daily-maintenance/fcu-report/view/${newReport.id}`;
      // Send notifications to all managers
      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Replace with the actual template ID
            userId: manager.id,
            createdById: creatorId, // Use the parsed integer
            altText: `A new FCU report has been created by ${creator.name} with remarks: ${remarks}`,
            link: reportLink, // Add the report link her
            isRead: false,
            sentAt: new Date(),
          },
        })
      );
    
      await Promise.all(notificationPromises);
    
      // Return success response with the created report
      return res.status(201).json(newReport);
    } catch (error) {
      console.error('Error creating FCU report:', error);
      return res.status(500).json({ error: 'Failed to create FCU report' });
    }
    
  }

  // Method not allowed for other HTTP methods
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
