import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'; // ✅ For decoding the token

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// ✅ Function to extract user info from token
const getUserFromToken = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    console.log("Received Token:", token); // ✅ Log token before verification

    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('❌ JWT Error:', error);
    return null;
  }
};


export default async function handler(req, res) {
  const { id } = req.query; // Tenant ID from query params
  const { method } = req;
  const user = getUserFromToken(req); // ✅ Extract user details

  if (method === 'GET') {
    try {
      console.log('🔵 Fetching filtered feedback complaints');
  
      // Extract query parameters
      const { attendedBy, complainNo, status, dateFrom, dateTo } = req.query;
  
      let whereCondition = {};
  
      // ✅ Fix: Partial matching for `attendedBy`
      if (attendedBy) {
        whereCondition.attendedBy = {
          contains: attendedBy,  // Enables partial search
        };
      }
  
      // ✅ Fix: Partial matching for `complainNo`
      if (complainNo) {
        whereCondition.complainNo = {
          contains: complainNo,  // Enables partial search
        };
      }
  
      // ✅ Exact match for status
      if (status) {
        whereCondition.status = status;
      }
  
      // ✅ Date range filter
      if (dateFrom && dateTo) {
        whereCondition.date = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        };
      }
  
      console.log("🔹 Applied Filters:", JSON.stringify(whereCondition));
  
      // Fetch complaints with applied filters
      const feedbackComplains = await prisma.feedbackComplain.findMany({
        where: whereCondition,
        orderBy: { date: 'desc' },
        include: {
          tenant: { select: { tenantName: true } }, // Include tenant name
          jobSlips: { select: { id: true } }, // Include related job slips
        },
      });
  
      console.log('🟢 Fetched complaints:', feedbackComplains.length);
      return res.status(200).json(feedbackComplains);
    } catch (error) {
      console.error('❌ Error fetching complaints:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  
  


  else if (method === 'POST') {
    const {
      complain, date, complainBy, floorNo, area, location, locations,listServices,
      materialReq, actionTaken, attendedBy, remarks, status, tenantId
    } = req.body;

    const formattedFloorNo = typeof floorNo === 'string' ? floorNo : String(floorNo);

    if (!complain || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields: complain, date, or status' });
    }

    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId is required for tenants' });
    }

    try {
      const formattedDate = new Date(date);
      if (isNaN(formattedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const timestamp = Date.now();
      const complainNo = `CMP-${timestamp}`;

      console.log('🔵 Creating Complaint:', {
        complainNo, complain, date: formattedDate, complainBy, floorNo, area,
        location, locations,listServices, materialReq, actionTaken, attendedBy, remarks, status, tenantId
      });

      const newComplain = await prisma.feedbackComplain.create({
        data: {
          complainNo, complain, date: formattedDate, complainBy: String(complainBy),
          floorNo: formattedFloorNo, area, location, locations,listServices, materialReq,
          actionTaken, attendedBy, remarks, status, tenantId,
        },
      });

      console.log('✅ Feedback Complaint Created:', newComplain);

      // ✅ Fetch Notification Template
      const template = await prisma.notificationTemplate.findUnique({
        where: { name: 'Added Jobslip' },
      });

      if (!template) {
        console.warn('⚠️ Warning: Notification template "Added FeedbackComplain" not found.');
        return res.status(500).json({ error: 'Notification template not found' });
      }

      // ✅ Fetch Recipients (SuperAdmin, Admin, Manager, Supervisors in "Building")
      const [superAdmins, admins, managers, supervisors] = await Promise.all([
        prisma.user.findMany({ where: { role: { name: 'SuperAdmin' } }, select: { id: true, name: true } }),
        prisma.user.findMany({ where: { role: { name: 'Admin' } }, select: { id: true, name: true } }),
        prisma.user.findMany({ where: { role: { name: 'Manager' } }, select: { id: true, name: true } }),
        prisma.user.findMany({ 
          where: { role: { name: 'Supervisor' }, department: { name: 'Building' } }, 
          select: { id: true, name: true } 
        }),
      ]);

      const allRecipients = [...superAdmins, ...admins, ...managers, ...supervisors]
      .filter(user => user.id !== user?.id); // Exclude the creator



      console.log('🔹 Sending notifications to:', allRecipients.map(u => u.name));

      if (allRecipients.length === 0) {
        console.warn('⚠️ Warning: No recipients found for notifications.');
      }

      // ✅ Create Notifications
      const notificationPromises = allRecipients.map((user) =>
        prisma.notification.create({
          data: {
            templateId: template.id,
            userId: user.id,
            createdById: user.id,
            isRead: false,
            altText: `Hello ${user.name}, a new feedback complain (${complainNo}) has been submitted.`,
            link: `/customer-relation/feedback-complain/view/${newComplain.id}`,
          },
        })
      );

      await Promise.all(notificationPromises);
      console.log('✅ Notifications successfully created');

      return res.status(201).json(newComplain);
    } catch (error) {
      console.error('❌ Error creating complaint:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` });
}
