import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Complaint ID is required' });
  }

  if (req.method === "GET") {
    try {

      
      if (id) {
        // Fetch a single feedback complaint by ID
        const feedbackComplain = await prisma.feedbackComplain.findUnique({
          where: { id: parseInt(id) },
          include: {
            tenant: {
              select: { tenantName: true },
            },
            jobSlips: true,
          },
        });

        if (!feedbackComplain) {
          return res.status(404).json({ error: "Feedback complaint not found" });
        }

        return res.status(200).json({
          id: feedbackComplain.id,
          complain: feedbackComplain.complain,
          complainNo: feedbackComplain.complainNo,
          date: feedbackComplain.date.toISOString(),
          complainBy: feedbackComplain.complainBy || "N/A",
          floorNo: feedbackComplain.floorNo,
          area: feedbackComplain.area,
          location: feedbackComplain.location,
          locations: feedbackComplain.locations || "NULL",
          listServices: feedbackComplain.listServices,
          materialReq: feedbackComplain.materialReq || "N/A",
          actionTaken: feedbackComplain.actionTaken || "N/A",
          attendedBy: feedbackComplain.attendedBy || "N/A",
          remarks: feedbackComplain.remarks,
          status: feedbackComplain.status,
          tenant: feedbackComplain.tenant ? feedbackComplain.tenant.tenantName : "N/A",
          jobSlips: feedbackComplain.jobSlips.map((job) => job),
        });
      }

      // Fetch all feedback complaints if no ID is provided
      const feedbackComplains = await prisma.feedbackComplain.findMany({
        orderBy: { date: "desc" },
        include: {
          tenant: {
            select: { tenantName: true },
          },
          jobSlips: {
            select: { id: true },
          },
        },
      });

      const serializedData = feedbackComplains.map((item) => ({
        id: item.id,
        complain: item.complain,
        complainNo: item.complainNo,
        date: item.date.toISOString(),
        complainBy: item.complainBy || "N/A",
        floorNo: item.floorNo,
        area: item.area,
        location: item.location,
        locations: item.locations || "NULL",
        listServices: item.listServices,
        materialReq: item.materialReq || "N/A",
        actionTaken: item.actionTaken || "N/A",
        attendedBy: item.attendedBy || "N/A",
        remarks: item.remarks,
        status: item.status,
        tenant: item.tenant ? item.tenant.tenantName : "N/A",
        jobSlips: item.jobSlips.map((job) => job.id),
      }));

      return res.status(200).json(serializedData);
    } catch (error) {
      console.error("Error fetching feedback complaints:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  else if (method === 'PUT') {
    const {
      complain,
      date,
      complainBy,
      floorNo,
      area,
      location,
      locations,
      listServices,
      materialReq,
      actionTaken,
      attendedBy,
      remarks,
      status,
    } = req.body;
  
    const formattedFloorNo = typeof floorNo === 'string' ? floorNo : String(floorNo);
    const complaintId = parseInt(id);
  
    if (!complain || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields: complain, date, or status' });
    }
  
    try {
      // Fetch existing complaint before updating
      const existingComplaint = await prisma.feedbackComplain.findUnique({
        where: { id: complaintId },
        select: { status: true, complainNo: true }, // Fetching only required fields
      });
  
      if (!existingComplaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
  
      const formattedDate = new Date(date);
      if (isNaN(formattedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
  
      console.log('🔄 Updating Complaint:', {
        complain,
        date: formattedDate,
        complainBy,
        floorNo,
        area,
        location,
        locations,
        listServices,
        materialReq,
        actionTaken,
        attendedBy,
        remarks,
        status,
      });
  
      // ✅ Check if status has changed
      const statusChanged = existingComplaint.status !== status;
  
      // ✅ Update Complaint
      const updatedComplain = await prisma.feedbackComplain.update({
        where: { id: complaintId },
        data: {
          complain,
          date: formattedDate,
          complainBy,
          floorNo: formattedFloorNo,
          area,
          location,
          locations,
          listServices,
          materialReq,
          actionTaken,
          attendedBy,
          remarks,
          status,
        },
      });
  
      console.log('✅ Complaint Updated:', updatedComplain);
  
      // ✅ If status changed, create notifications
      if (statusChanged) {
        console.log(`🔔 Status changed: "${existingComplaint.status}" ➝ "${status}"`);
  
        // ✅ Fetch Notification Template
        const template = await prisma.notificationTemplate.findUnique({
          where: { name: 'Added Jobslip' },
        });
  
        if (!template) {
          console.warn('⚠️ Warning: Notification template "Status Change FeedbackComplain" not found.');
          return res.status(500).json({ error: 'Notification template not found' });
        }
  
        // ✅ Fetch Recipients (SuperAdmin, Admin, Manager, Supervisors in "Building")
        const [superAdmins, admins, managers, supervisors] = await Promise.all([
          prisma.user.findMany({ where: { role: { name: 'SuperAdmin' } }, select: { id: true, name: true } }),
          prisma.user.findMany({ where: { role: { name: 'Admin' } }, select: { id: true, name: true } }),
          prisma.user.findMany({ where: { role: { name: 'Manager' } }, select: { id: true, name: true } }),
          prisma.user.findMany({
            where: { role: { name: 'Supervisor' }, department: { name: 'Building' } },
            select: { id: true, name: true },
          }),
        ]);
  
        const allRecipients = [...superAdmins, ...admins, ...managers, ...supervisors];
  
        console.log('🔹 Sending status change notifications to:', allRecipients.map(u => u.name));
  
        if (allRecipients.length > 0) {
          const notificationPromises = allRecipients.map((user) =>
            prisma.notification.create({
              data: {
                templateId: template.id,
                userId: user.id,
                createdById: user.id,
                isRead: false,
                altText: `Hello ${user.name}, the status of feedback complaint (${existingComplaint.complainNo}) has changed to "${status}".`,
                link: `/customer-relation/feedback-complain/view/${updatedComplain.id}`,
              },
            })
          );
  
          await Promise.all(notificationPromises);
          console.log('✅ Status Change Notifications Sent');
        } else {
          console.warn('⚠️ Warning: No recipients found for status change notifications.');
        }
      }
  
      return res.status(200).json(updatedComplain);
    } catch (error) {
      console.error('❌ Error updating complaint:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
   else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
