import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch all users
    try {
      const users = await prisma.user.findMany({
        include: {
          role: true,
          department: true,  // Include department info if needed
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users"+error });
    }
  } else if (req.method === "POST") {
    // Create a new user
    const { name, email, username, password, roleId, departmentId } = req.body;
    try {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password: hashedPassword,
          roleId:parseInt(roleId),
          departmentId:parseInt(departmentId),
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user"+error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
