import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
          include: { role: true },
        });
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching user'+error });
      }
      break;

    case 'PUT':
      const { name, email, username, departmentId,password, roleId } = req.body;
      console.log(req.body)
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: { name, email, username,password:hashedPassword, departmentId:parseInt(departmentId),roleId:parseInt(roleId)},
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ error: 'Error updating user'+error });
      }
      break;

    case 'DELETE':
      try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Error deleting user'+error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
