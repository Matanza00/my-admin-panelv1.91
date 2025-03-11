import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      // Get a specific RoleDepartmentPermission by ID
      const roleDepartmentPermission = await prisma.roleDepartmentPermission.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          role: true,
          department: true,
          permission: true,
        },
      });
      if (!roleDepartmentPermission) {
        return res.status(404).json({ error: "Role-Department Permission not found" });
      }
      return res.status(200).json(roleDepartmentPermission);
    } else if (req.method === "PUT") {
      const { roleId, departmentId, permissionId } = req.body;

      // Validate inputs
      if (!roleId || !departmentId || !permissionId) {
        return res.status(400).json({ error: "roleId, departmentId, and permissionId are required" });
      }

      const updatedPermission = await prisma.roleDepartmentPermission.update({
        where: { id: parseInt(id, 10) },
        data: { roleId, departmentId, permissionId },
      });
      return res.status(200).json(updatedPermission);
    } else if (req.method === "DELETE") {
      await prisma.roleDepartmentPermission.delete({
        where: { id: parseInt(id, 10) },
      });
      return res.status(204).end(); // No content
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
