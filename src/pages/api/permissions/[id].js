import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      // Get a specific permission by ID
      const permission = await prisma.permission.findUnique({
        where: { id: parseInt(id) },
      });
      if (!permission) return res.status(404).json({ error: "Permission not found" });
      return res.status(200).json(permission);
    } else if (req.method === "PUT") {
      try {
        // Extract name from the request body
        const { name } = req.body;
        
        // Validate input
        if (!name || typeof name !== "string" || name.trim() === "") {
          return res.status(400).json({ error: "Valid name is required" });
        }

        // Parse `id` from query params
        const permissionId = parseInt(id, 10);
        if (isNaN(permissionId)) {
          return res.status(400).json({ error: "Invalid permission ID" });
        }

        // Update permission in the database
        const updatedPermission = await prisma.permission.update({
          where: { id: permissionId },
          data: { name: name.trim() }, // Trim unnecessary whitespace
        });

        // Return the updated permission
        return res.status(200).json(updatedPermission);
      } catch (error) {
        console.error("Error updating permission:", error);

        if (error.code === "P2025") {
          return res.status(404).json({ error: "Permission not found" });
        }

        return res.status(500).json({ error: "Internal server error" });
      }
    } else if (req.method === "DELETE") {
      // Delete the permission
      await prisma.permission.delete({
        where: { id: parseInt(id, 10) },
      });

      return res.status(204).end(); // No content after successful deletion
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
