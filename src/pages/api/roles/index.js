// pages/api/roles.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const roles = await prisma.role.findMany();
        res.status(200).json(roles);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching roles'+error });
      }
      break;

    case 'POST':
      const { name } = req.body;
      try {
        const newRole = await prisma.role.create({
          data: { name },
        });
        res.status(201).json(newRole);
      } catch (error) {
        res.status(500).json({ error: 'Error creating role'+error });
      }
      break;

    case 'DELETE':
      const { id } = req.query;
      try {
        await prisma.role.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Error deleting role'+error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

