// pages/api/roles/assignPermissions.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { roleId, permissionIds } = req.body;

    try {
      // Delete existing permissions for the role
      await prisma.rolePermission.deleteMany({
        where: { roleId: parseInt(roleId) },
      });

      // Assign new permissions to the role
      const rolePermissions = permissionIds.map((permissionId) => ({
        roleId: parseInt(roleId),
        permissionId: parseInt(permissionId),
      }));

      await prisma.rolePermission.createMany({
        data: rolePermissions,
      });

      res.status(200).json({ message: 'Permissions assigned successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to assign permissions' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
