import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      // Get a specific department by ID
      const department = await prisma.department.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      return res.status(200).json(department);
    } else if (req.method === "PUT") {
      // Extract `name` and `code` from the request body
      const { name, code } = req.body;

      // Validate input
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Valid name is required" });
      }
      if (code && typeof code !== "string") {
        return res.status(400).json({ error: "Code must be a valid string" });
      }

      // Parse `id` from query params
      const departmentId = parseInt(id, 10);
      if (isNaN(departmentId)) {
        return res.status(400).json({ error: "Invalid department ID" });
      }

      // Update department in the database
      const updatedDepartment = await prisma.department.update({
        where: { id: departmentId },
        data: {
          name: name.trim(),
          code: code ? code.trim() : null, // Update or set to null if empty
        },
      });

      // Return the updated department
      return res.status(200).json(updatedDepartment);
    } else if (req.method === "DELETE") {
      // First, nullify departmentId for all users linked to this department
      const departmentId = parseInt(id, 10);
      if (isNaN(departmentId)) {
        return res.status(400).json({ error: "Invalid department ID" });
      }

      await prisma.user.updateMany({
        where: { departmentId },
        data: { departmentId: null }, // Set departmentId to null for all users linked to this department
      });

      // Now delete the department
      await prisma.department.delete({
        where: { id: departmentId },
      });

      return res.status(204).end(); // No content after successful deletion
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Department not found" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}
