// pages/api/roles/[id].js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const role = await prisma.role.findUnique({
          where: { id: parseInt(id, 10) },
        });

        if (!role) {
          return res.status(404).json({ error: "Role not found" });
        }

        res.status(200).json(role);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch role" });
      }
      break;

    case "PUT":
      try {
        const { name } = req.body;
        console.log(req.body)
        // Validate input
        if (!name || name.trim() === "") {
          return res.status(400).json({ error: "Role name is required" });
        }

        const updatedRole = await prisma.role.update({
          where: { id: parseInt(id, 10) },
          data: { name: name.trim() },
        });

        res.status(200).json(updatedRole);
      } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
          res.status(404).json({ error: "Role not found" });
        } else {
          res.status(500).json({ error: "Failed to update role" });
        }
      }
      break;case "DELETE":
      try {
        // First, check if the role exists
        const roleToDelete = await prisma.role.findUnique({
          where: { id: parseInt(id, 10) },
        });
    
        if (!roleToDelete) {
          return res.status(404).json({ error: "Role not found" });
        }
    
        // Nullify roleId for all users associated with this role
        await prisma.user.updateMany({
          where: { roleId: parseInt(id, 10) },
          data: { roleId: null }, // Set roleId to null for all users linked to this role
        });
    
        // Now, delete the role
        await prisma.role.delete({
          where: { id: parseInt(id, 10) },
        });
    
        res.status(204).end(); // No content to return after successful deletion
      } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
          res.status(404).json({ error: "Role not found" });
        } else if (error.code === "P2003") {
          // This error indicates a foreign key constraint violation
          res.status(400).json({ error: "Foreign key constraint violation" });
        } else {
          res.status(500).json({ error: "Failed to delete role" });
        }
      }
      break;
    
      
      
    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
