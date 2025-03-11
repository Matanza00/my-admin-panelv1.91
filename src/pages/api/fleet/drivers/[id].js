import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const driver = await prisma.driver.findUnique({
          where: { id: parseInt(id) },
          include: { cars: true }, // Include cars associated with the driver
        });

        if (!driver) {
          return res.status(404).json({ error: "Driver not found" });
        }

        res.status(200).json(driver);
      } catch (error) {
        res.status(500).json({ error: "Error fetching driver", details: error.message });
      }
      break;

    case "PUT":
      try {
        const { name, age, department, phoneNo, cnic, emergencyContact } = req.body;

        const updatedDriver = await prisma.driver.update({
          where: { id: parseInt(id) },
          data: { 
            name, 
            age: parseInt(age, 10), // Ensure age is an integer
            department, 
            phoneNo, 
            cnic, 
            emergencyContact 
          },
        });

        res.status(200).json(updatedDriver);
      } catch (error) {
        res.status(500).json({ error: "Error updating driver", details: error.message });
      }
      break;

    case "DELETE":
      try {
        await prisma.driver.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: "Error deleting driver", details: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
