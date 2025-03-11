import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { roles, departments } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Parse roles and departments from the query
        const roleNames = roles ? roles.split(',') : [];
        const departmentNames = departments ? departments.split(',') : [];

        // Fetch filtered users
        const users = await prisma.user.findMany({
          where: {
            AND: [
              roleNames.length > 0
                ? { role: { name: { in: roleNames } } }
                : {},
              departmentNames.length > 0
                ? { department: { name: { in: departmentNames } } }
                : {},
            ],
          },
          include: {
            role: true,
            department: true,
          },
        });

        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching filtered users: ' + error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}