import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Get all RoleDepartmentPermissions
      const roleDepartmentPermissions = await prisma.roleDepartmentPermission.findMany({
        include: {
          role: true,
          department: true,
          permission: true,
        },
      });
      return res.status(200).json(roleDepartmentPermissions);
    } else if (req.method === "POST") {
      const { roleId, departmentId, permissionId } = req.body;

      // Validate inputs
      if (!roleId || !departmentId || !permissionId) {
        return res.status(400).json({ error: "roleId, departmentId, and permissionId are required" });
      }

      const newPermission = await prisma.roleDepartmentPermission.create({
        data: { roleId:parseInt(roleId), departmentId:parseInt(departmentId), permissionId:parseInt(permissionId) },
      });
      return res.status(201).json(newPermission);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
