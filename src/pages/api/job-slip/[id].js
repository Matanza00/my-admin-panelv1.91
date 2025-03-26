import { PrismaClient } from '@prisma/client'; // Import Prisma Client directly
import nodemailer from 'nodemailer';

const prisma = new PrismaClient(); // Initialize Prisma client

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // ================================
    // Handle GET Request
    // ================================
    case 'GET':
      try {
        const { id } = req.query;

        // Fetch the job slip by its ID
        const jobSlip = await prisma.jobSlip.findUnique({
          where: { id: parseInt(id) },
          include: {
            feedbackComplain: true, // Include related feedback complain if needed
          },
        });

        if (!jobSlip) {
          return res.status(404).json({ message: 'Job slip not found' });
        }

        // Parse attendedBy as an array of IDs
        const attendedByIds = jobSlip.attendedBy
          ? jobSlip.attendedBy.split(',').map((id) => parseInt(id)).filter((id) => !isNaN(id))
          : [];

        // Fetch all user names for the attendedBy IDs
        const users = attendedByIds.length
          ? await prisma.user.findMany({
              where: { id: { in: attendedByIds } },
              select: { id: true, name: true },
            })
          : [];

        // Fetch the department name (optional)
        const department = jobSlip.department
          ? await prisma.department.findUnique({
              where: { id: parseInt(jobSlip.department) },
              select: { name: true },
            })
          : null;

        // Build a response with user names and department name
        const jobSlipWithNames = {
          ...jobSlip,
          attendedBy: users.map((user) => user.name).join(', ') || 'N/A', // Convert to readable names
          department: department ? department.name : 'N/A',
        };

        return res.status(200).json(jobSlipWithNames);
      } catch (error) {
        console.error('Error fetching job slip:', error);
        return res.status(500).json({ message: 'Error fetching job slip' });
      }

    // ================================
    // Handle PUT Request
    // ================================
    case 'PUT':
  try {
    const {
      jobId,
      complainNo,
      materialReq,
      actionTaken,
      attendedBy, 
      remarks,
      status,
      supervisorApproval,
      managementApproval,
      completed_At,
      picture,
    } = req.body;

    if (!jobId || !complainNo || !materialReq || !actionTaken || !attendedBy || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const attendedByValidated = attendedBy
      .split(',')
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id))
      .join(',');

    let updatedPicture = null;
    if (picture) {
      const pictureArray = picture.split(',').map((img) => img.trim()).filter(Boolean);
      if (pictureArray.length > 0) {
        updatedPicture = pictureArray.join(',');
      }
    }

    let updatedStatus = status;
    let updatedCompletedAt = completed_At;

    if (updatedPicture) {
      updatedStatus = supervisorApproval ? 'Verified & Closed' : 'Verified & Closed';
      updatedCompletedAt = new Date();
    }
    if (supervisorApproval) {
      updatedStatus = "Verified & Closed";
    }

    // ✅ Fetch existing job slip before updating
    const existingJobSlip = await prisma.jobSlip.findUnique({
      where: { id: parseInt(req.query.id) },
      select: { status: true, jobId: true },
    });

    if (!existingJobSlip) {
      return res.status(404).json({ error: 'Job Slip not found' });
    }

    // ✅ Check if status has changed
    const statusChanged = existingJobSlip.status !== updatedStatus;

    // ✅ Update the job slip
    const updatedJobSlip = await prisma.jobSlip.update({
      where: { id: parseInt(req.query.id) },
      data: {
        jobId,
        complainNo,
        materialReq,
        actionTaken,
        attendedBy: attendedByValidated,
        remarks,
        status: updatedStatus,
        supervisorApproval,
        managementApproval,
        completed_At: updatedCompletedAt,
        picture: updatedPicture,
        updatedAt: new Date(),
      },
    });

    // ✅ Check if all job slips with the same complainNo are completed
    const allJobSlipsCompleted = await prisma.jobSlip.findMany({
      where: { complainNo, status: 'Completed' },
    });

    const allJobSlips = await prisma.jobSlip.findMany({
      where: { complainNo },
    });

    if (allJobSlipsCompleted.length === allJobSlips.length) {
      await prisma.feedbackComplain.update({
        where: { complainNo },
        data: { status: 'Verified & Closed' },
      });
    }

    // ✅ Send notification if status changed
    if (statusChanged) {
      console.log(`🔔 Status changed: "${existingJobSlip.status}" ➝ "${updatedStatus}"`);

      // ✅ Fetch Notification Template
      const template = await prisma.notificationTemplate.findUnique({
        where: { name: 'Added Jobslip' },
      });

      if (!template) {
        console.warn('⚠️ Warning: Notification template "JobSlip Status Change" not found.');
      } else {
        // ✅ Fetch Assigned Technicians
        const technicianIds = attendedByValidated.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
        const technicians = await prisma.user.findMany({
          where: { id: { in: technicianIds } },
          select: { id: true, name: true, email: true },
        });

        // ✅ Fetch Managers & Bookkeeper
        const managers = await prisma.user.findMany({
          where: { role: { name: 'Manager' } },
          select: { id: true, name: true, email: true },
        });

        const bookkeeper = await prisma.user.findFirst({
          where: { role: { name: 'Bookkeeper' } },
          select: { id: true, name: true, email: true },
        });

        const allRecipients = [...technicians, ...managers, ...(bookkeeper ? [bookkeeper] : [])];

        console.log('🔹 Sending status change notifications to:', allRecipients.map(u => u.name));

        if (allRecipients.length > 0) {
          const notificationPromises = allRecipients.map((user) =>
            prisma.notification.create({
              data: {
                templateId: template.id,
                userId: user.id,
                createdById: user.id,
                isRead: false,
                altText: `Hello ${user.name}, the status of JobSlip ${existingJobSlip.jobId} has changed to "${updatedStatus}".`,
                link: `/customer-relation/job-slip/view/${updatedJobSlip.id}`,
              },
            })
          );

          await Promise.all(notificationPromises);
          console.log('✅ Status Change Notifications Sent');
        } else {
          console.warn('⚠️ Warning: No recipients found for status change notifications.');
        }

        // ✅ Send Email Notifications
        if (allRecipients.length > 0) {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const emailPromises = allRecipients.map((user) =>
            transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject: `JobSlip ${existingJobSlip.jobId} Status Update`,
              text: `Hello ${user.name},\n\nThe status of JobSlip (${existingJobSlip.jobId}) has changed to "${updatedStatus}".\n\nPlease review it at the following link:\n\n${process.env.APP_URL}/customer-relation/job-slip/view/${updatedJobSlip.id}\n\nThank you.`,
            })
          );

          await Promise.all(emailPromises);
          console.log('✅ Status Change Emails Sent');
        }
      }
    }

    // ✅ Below Part is for feedback of the complaint
const feedbackComplain = await prisma.feedbackComplain.findFirst({
  where: { complainNo },
  select: {
    id: true,
    attendedBy: true,
    complainNo: true,
    jobSlips: { select: { status: true } },
  },
});

if (feedbackComplain) {
  const allClosed = feedbackComplain.jobSlips.every(js => js.status === 'Verified & Closed');

  if (allClosed && feedbackComplain.attendedBy) {
    // Use exact match (case-sensitive unless you normalize)
    const complainUser = await prisma.user.findFirst({
      where: {
        name: feedbackComplain.attendedBy,
      },
      select: { id: true, name: true },
    });

    const feedbackTemplate = await prisma.notificationTemplate.findUnique({
      where: { name: 'Added Jobslip' },
    });

    if (complainUser && feedbackTemplate) {
      await prisma.notification.create({
        data: {
          templateId: feedbackTemplate.id,
          userId: complainUser.id,
          createdById: complainUser.id,
          isRead: false,
          altText: `Hello ${complainUser.name}, your complaint ${feedbackComplain.complainNo} has been fully resolved. Please fill the feedback form .`,
          link: `/customer-relation/feedback-complain/view/${feedbackComplain.id}`,
        },
      });
        
          
            // Send email
          // const transporter = nodemailer.createTransport({
          //   host: process.env.EMAIL_HOST,
          //   port: process.env.EMAIL_PORT,
          //   secure: process.env.EMAIL_SECURE === 'true',
          //   auth: {
          //     user: process.env.EMAIL_USER,
          //     pass: process.env.EMAIL_PASS,
          //   },
          // });
        
          //   await transporter.sendMail({
          //     from: process.env.EMAIL_FROM,
          //     to: complainUser.email,
          //     subject: `Complaint ${feedbackComplain.complainNo} Resolved`,
          //     text: `Hello ${complainUser.name},\n\nAll job slips for your complaint (${feedbackComplain.complainNo}) have been completed.
          //     \n\nPlease review it at the following link:\n\n${process.env.APP_URL}/customer-relation/feedback-complain/view/${feedbackComplain.id}\n\n\n\nThank you.`,
          //   });
            console.log('✅ Notified complain creator of full resolution');
          } else {
            console.warn(
              `⚠️ Skipping notification — missing ${
                !complainUser ? 'complainUser' : ''
              } ${!complainUser && !feedbackTemplate ? 'and' : ''} ${
                !feedbackTemplate ? 'feedbackTemplate' : ''
              }`
            );
            
          }
        }}
  


    res.status(200).json(updatedJobSlip);
  } catch (error) {
    console.error('❌ Error updating job slip:', {
      name: error?.name || 'UnknownError',
      message: error?.message || 'No message provided',
      stack: error?.stack || 'No stack trace',
    });
    
    res.status(500).json({ error: 'Error updating job slip', message: error.message });
  }
  break;

    
    // ================================
    // Handle DELETE Request
    // ================================
    case 'DELETE':
      try {
        const { id } = req.query;

        // Delete the job slip
        const deletedJobSlip = await prisma.jobSlip.delete({
          where: {
            id: parseInt(id),
          },
        });

        res.status(200).json({ message: 'Job slip deleted successfully', deletedJobSlip });
      } catch (error) {
        console.error('Error deleting job slip:', error);
        res.status(500).json({ error: 'An error occurred while deleting job slip' });
      }
      break;

    // ================================
    // Handle Unsupported Methods
    // ================================
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}
