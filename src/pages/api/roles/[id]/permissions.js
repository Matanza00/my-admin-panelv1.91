// pages/api/roles/[id]/permissions.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const role = await prisma.role.findUnique({
        where: { id: parseInt(id) },
        include: { permissions: true }, // Include related permissions
      });
      res.status(200).json(role.permissions); // Return role permissions as JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch role permissions' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
