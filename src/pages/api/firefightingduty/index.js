import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page = 1, shift, date, users } = req.query;
      const pageSize = 10;
      const filters = {};

      if (shift) filters.shift = shift;
      if (date) filters.date = new Date(date);
      if (users) filters.users = { some: { id: parseInt(users) } };

      const data = await prisma.firefightingDuty.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: filters,
        include: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const dutiesWithUserCount = data.map((duty) => ({
        ...duty,
        userCount: duty.users.length,
      }));

      const totalRecords = await prisma.firefightingDuty.count({ where: filters });
      const nextPage = page * pageSize < totalRecords;

      res.status(200).json({
        data: dutiesWithUserCount,
        nextPage,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else if (req.method === 'POST') {
    try {
      const { date, shift, users, createdById } = req.body;

      // Validation: Ensure all required fields are present
      if (!date || !shift || !users || users.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new firefighting duty entry in the database
      const newDuty = await prisma.firefightingDuty.create({
        data: {
          date: new Date(date), // Make sure date is in Date format
          shift,
          users: {
            connect: users.map((user) => ({ id: user.id })),
          },
        },
      });

      // Fetch the creator's name
      const creator = await prisma.user.findUnique({
        where: { id: parseInt(createdById, 10) },
        select: { name: true },
      });

      if (!creator) {
        return res.status(400).json({ error: 'Invalid creator ID' });
      }

      // Notify Managers
      const managers = await prisma.user.findMany({
        where: {
          role: {
            name: 'Manager', // Adjust to match your role schema
          },
        },
        select: { id: true, name: true },
      });

      const notificationPromises = managers.map((manager) =>
        prisma.notification.create({
          data: {
            templateId: 2, // Adjust template ID
            userId: manager.id,
            createdById: parseInt(createdById, 10),
            altText: `A new firefighting duty for shift: ${shift} , created by ${creator.name}.`,
            link: `/security-services/firefighting-duty/view/${newDuty.id}`,
            isRead: false,
            sentAt: new Date(),
          },
        })
      );

      await Promise.all(notificationPromises);

      // Respond with the newly created duty
      return res.status(201).json(newDuty);
    } catch (error) {
      console.error('Error creating firefighting duty:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
