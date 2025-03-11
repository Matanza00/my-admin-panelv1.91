import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': // ✅ Fetch user notifications
      try {
        const { userId, page = 1, limit = 10 } = req.query;

        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        // console.log("🔵 Fetching notifications for userId:", userId);

        // ✅ Fetch both unread and recently created notifications (last 10 mins)
        const notifications = await prisma.notification.findMany({
          where: { 
            userId: parseInt(userId),
            OR: [
              { isRead: false }, // ✅ Unread notifications
              { createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } } // ✅ Last 10 mins notifications
            ]
          },
          include: {
            template: {
              select: {
                id: true,
                templateText: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit),
        });

        // ✅ Ensure the unread count is **properly calculated**
        const unreadCount = notifications.filter(notif => !notif.isRead).length;

        // ✅ Process notifications to replace `{altText}` dynamically
        const processedNotifications = notifications.map((notif) => {
          let templateText = notif.template?.templateText || "No template available";
        
          // ✅ Replace {altText} with actual altText from the notification
          if (templateText.includes("{altText}")) {
            templateText = templateText.replace("{altText}", notif.altText);
          }
        
          return {
            ...notif,
            template: {
              ...notif.template,
              templateText, // ✅ Assign modified text
            },
          };
        });

        // console.log("🟢 Processed Notifications:", processedNotifications);
        // console.log("📌 Unread notifications count:", unreadCount);

        return res.status(200).json({
          notifications: processedNotifications,
          unreadCount,  // ✅ Ensure the count is sent correctly
          hasMore: notifications.length === parseInt(limit),
        });

      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        return res.status(500).json({ error: 'Error fetching notifications' });
      }

    case 'PUT': // ✅ Mark notification as read
      try {
        const { notificationId } = req.body;

        if (!notificationId) {
          return res.status(400).json({ message: 'Notification ID is required' });
        }

        // ✅ Update the notification as read
        await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true },
        });

        // ✅ Fetch updated unread count
        const updatedUnreadCount = await prisma.notification.count({
          where: { userId: parseInt(req.body.userId), isRead: false },
        });

        // console.log("✅ Notification marked as read. New unread count:", updatedUnreadCount);

        return res.status(200).json({ message: 'Notification marked as read', unreadCount: updatedUnreadCount });
      } catch (error) {
        console.error('❌ Error updating notification:', error);
        return res.status(500).json({ message: 'Error updating notification' });
      }

    default:
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
