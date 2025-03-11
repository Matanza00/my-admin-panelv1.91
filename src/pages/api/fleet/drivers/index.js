import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const drivers = await prisma.driver.findMany({
          include: { cars: true },
        });
        res.status(200).json(drivers);
      } catch (error) {
        res.status(500).json({ error: "Error fetching drivers", details: error.message });
      }
      break;

      case "POST":
        try {
          // Extract and validate fields
          let { name, age, department, phoneNo, cnic, emergencyContact } = req.body;
  
          // Ensure `age` is converted to an integer
          age = parseInt(age, 10);
          if (isNaN(age)) {
            return res.status(400).json({ error: "Invalid age. Must be a number." });
          }
  
          const newDriver = await prisma.driver.create({
            data: {
              name,
              age,
              department,
              phoneNo,
              cnic,
              emergencyContact,
            },
          });
  
          return res.status(201).json(newDriver);
        } catch (error) {
          console.error("❌ Error creating driver:", error);
          return res.status(500).json({ error: "Error creating driver", details: error.message });
        }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
