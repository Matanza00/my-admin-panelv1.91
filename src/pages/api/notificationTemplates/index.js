// pages/api/notificationTemplates.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle CRUD operations for NotificationTemplate
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // GET: Fetch all notification templates
    case 'GET':
      try {
        const templates = await prisma.notificationTemplate.findMany();
        return res.status(200).json(templates);
      } catch (error) {
        return res.status(500).json({ error: 'Error fetching templates'+error });
      }

    // POST: Create a new notification template
    case 'POST':
      try {
        const { name, templateText, isEditable } = req.body;
        const newTemplate = await prisma.notificationTemplate.create({
          data: {
            name,
            templateText,
            isEditable,
          },
        });
        return res.status(201).json(newTemplate);
      } catch (error) {
        return res.status(500).json({ error: 'Error creating template'+error });
      }

    // PATCH: Edit an existing notification template
    case 'PATCH':
      try {
        const { id, name, templateText, isEditable } = req.body;
        const updatedTemplate = await prisma.notificationTemplate.update({
          where: { id },
          data: {
            name,
            templateText,
            isEditable,
          },
        });
        return res.status(200).json(updatedTemplate);
      } catch (error) {
        return res.status(500).json({ error: 'Error updating template'+error });
      }

    // DELETE: Delete a notification template
    case 'DELETE':
      const { id } = req.query; // Get the template ID from the query parameters
      try {
        await prisma.notificationTemplate.delete({
          where: { id: parseInt(id) },
        });
        return res.status(200).json({ message: 'Template deleted successfully' });
      } catch (error) {
        return res.status(500).json({ error: 'Error deleting template'+error });
      }

    default:
      return res.status(405).json({ error: `Method ${method} Not Allowed`+error });
  }
}
