import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    return decoded.id;
  } catch (error) {
    console.error('JWT Error:', error.message);
    return null;
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  console.log('Preparing to send email...'); // Debug log
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // Use TLS if EMAIL_SECURE is "true"
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully:', info.messageId); // Debug log
  } catch (error) {
    console.error('Error sending email:', error.message); // Log specific error
    throw new Error('Email could not be sent'); // Re-throw for error handling
  }
};

export default async function handler(req, res) {
  const { id } = req.query;
  const { inventoryRecieptNo } = req.body;
  const notificationTemplateName = "Updated Jobslip Invoice";

  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.warn('Missing authorization token');
    return res.status(401).json({ message: 'Unauthorized: Token is missing' });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { id: userId } });
    console.log('Authenticated user:', user);
  } catch (error) {
    console.error('Error finding user:', error.message);
    return res.status(500).json({ message: 'Error finding user in database.' });
  }

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: User not found' });
  }

  if (req.method === 'PUT') {
    if (!id || isNaN(parseInt(id))) {
      console.warn('Invalid job slip ID:', id);
      return res.status(400).json({ message: 'Invalid job slip ID' });
    }

    if (!inventoryRecieptNo) {
      console.warn('Missing inventory receipt number');
      return res.status(400).json({ message: 'Inventory receipt number is required.' });
    }

    let updatedJobSlip;
    try {
      updatedJobSlip = await prisma.jobSlip.update({
        where: { id: parseInt(id) },
        data: {
          inventoryRecieptNo,
          status: 'In Progress',
        },
      });
      console.log('Job slip updated:', updatedJobSlip);
    } catch (error) {
      console.error('Error updating job slip:', error.message);
      return res.status(500).json({ message: 'Error updating job slip.' });
    }

    let template;
    try {
      template = await prisma.notificationTemplate.findUnique({
        where: { name: notificationTemplateName },
      });

      if (!template) {
        console.warn('Notification template not found:', notificationTemplateName);
        return res.status(404).json({ message: 'Notification template not found' });
      }
      console.log('Notification template found:', template);
    } catch (error) {
      console.error('Error finding notification template:', error.message);
      return res.status(500).json({ message: 'Error finding notification template.' });
    }

    try {
      const attendedByIds = updatedJobSlip.attendedBy
        ? updatedJobSlip.attendedBy.split(',').map((id) => parseInt(id.trim()))
        : [];
      console.log('Attended by IDs:', attendedByIds);

      const departments = await Promise.all(
        attendedByIds.map(async (attendeeId) => {
          const user = await prisma.user.findUnique({ where: { id: attendeeId } });
          return user?.departmentId || null;
        })
      );

      const uniqueDepartments = [...new Set(departments.filter(Boolean))];
      console.log('Unique departments:', uniqueDepartments);

      for (const departmentId of uniqueDepartments) {
        const manager = await prisma.user.findFirst({
          where: {
            departmentId,
            role: { name: 'manager' },
          },
        });

        if (manager) {
          console.log('Manager found for department:', manager);

          await prisma.notification.create({
            data: {
              templateId: template.id,
              userId: manager.id,
              createdById: user.id,
              isRead: false,
              altText: updatedJobSlip.jobId.toString(),
            },
          });
          console.log('Notification created for manager');

          await sendEmail({
            to: manager.email,
            subject: `Job Slip Updated: ${updatedJobSlip.jobId}`,
            text: `The job slip with ID ${updatedJobSlip.jobId} has been updated.`,
            html: `
              <p>Dear ${manager.name},</p>
              <p>The job slip with ID <strong>${updatedJobSlip.jobId}</strong> has been updated with the following details:</p>
              <ul>
                <li><strong>Inventory Receipt No:</strong> ${inventoryRecieptNo}</li>
                <li><strong>Status:</strong> In Progress</li>
              </ul>
              <p>Best regards,<br>Your System</p>
            `,
          });

          console.log(`Notification and email sent to manager ID ${manager.id}`);
        } else {
          console.warn(`No manager found for department ID: ${departmentId}`);
        }
      }
    } catch (error) {
      console.error('Error notifying or emailing managers:', error.message);
      return res.status(500).json({ message: 'Error notifying or emailing managers.' });
    }

    return res.status(200).json(updatedJobSlip);
  } else {
    console.warn('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
