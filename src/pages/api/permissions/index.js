import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Get all permissions
      const permissions = await prisma.permission.findMany();
      return res.status(200).json(permissions);
    } else if (req.method === "POST") {
      try {
        // Extract permission name from the request body
        const { name } = req.body;
        
        // Validate input
        if (!name || typeof name !== "string" || name.trim() === "") {
          return res.status(400).json({ error: "Valid name is required" });
        }

        // Create a new permission in the database
        const newPermission = await prisma.permission.create({
          data: { name: name.trim() }, // Trim unnecessary whitespace
        });

        return res.status(201).json(newPermission);
      } catch (error) {
        console.error("Error creating permission:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
