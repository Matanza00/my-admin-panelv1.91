import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Get all departments
      const departments = await prisma.department.findMany();
      return res.status(200).json(departments);
    } else if (req.method === "POST") {
      // Create a new department
      const { name, code } = req.body;
      
      // Validate input
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Valid name is required" });
      }
      if (code && typeof code !== "string") {
        return res.status(400).json({ error: "Code must be a valid string" });
      }

      const newDepartment = await prisma.department.create({
        data: {
          name: name.trim(),
          code: code ? code.trim() : null, // Include code if provided, or set to null
        },
      });
      return res.status(201).json(newDepartment);
    } else {
      // Method not allowed
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API:", error);

    if (error.code === "P2002") {
      // Handle unique constraint violations (e.g., duplicate name or code)
      return res.status(409).json({ error: "Department with this name or code already exists" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}
