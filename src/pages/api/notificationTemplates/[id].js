import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id, page = 1, limit = 10 } = req.query; // Get user ID, page, and limit from query parameters

  if (req.method === 'GET') {
    try {
      const userId = parseInt(id);

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Fetch notifications with pagination
      const notifications = await prisma.notification.findMany({
        where: { userId },
        include: {
          template: true, // Include the related notification template
        },
        orderBy: {
          createdAt: 'desc', // Order by creation date (most recent first)
        },
        skip: (page - 1) * limit, // Skip previous pages
        take: parseInt(limit), // Limit to specified number of results
      });

      if (notifications.length === 0) {
        return res.status(200).json({ notifications: [], hasMore: false });
      }

      // Enhance notifications by replacing placeholders with actual names
      const enhancedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const [targetUser, createdUser] = await Promise.all([
            prisma.user.findUnique({
              where: { id: notification.userId },
              select: { name: true },
            }),
            prisma.user.findUnique({
              where: { id: notification.createdById },
              select: { name: true },
            }),
          ]);

          const templateText = notification.template.templateText
            .replace('{targetUser}', targetUser?.name || 'Unknown User').replace('{altText}', notification?.altText)
            .replace('{createdUser}', createdUser?.name || 'Unknown Creator');

          return {
            ...notification,
            template: {
              ...notification.template,
              templateText,
            },
          };
        })
      );

      // Determine if there are more notifications
      const totalNotifications = await prisma.notification.count({ where: { userId } });
      const hasMore = page * limit < totalNotifications;

      return res.status(200).json({ notifications: enhancedNotifications, hasMore });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'Error fetching notifications' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { notificationId } = req.body;

      if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID is required' });
      }

      // Update notification as read
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ message: 'Error updating notification' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}