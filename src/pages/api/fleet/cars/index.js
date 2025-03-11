import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { method } = req;
  
    switch (method) {
      case "GET":
        try {
          const cars = await prisma.car.findMany({
            include: { 
              maintenanceRecords: true, 
              insurances: true 
            }, // Removed `driver` from the response
          });
          res.status(200).json(cars);
        } catch (error) {
          res.status(500).json({ error: "Error fetching cars", details: error.message });
        }
        break;
  
      case "POST":
        try {
          const { plate, vinNo, color, make, model, year } = req.body;

          // Convert `year` to an integer
          const parsedYear = parseInt(year, 10);
          if (isNaN(parsedYear)) {
            return res.status(400).json({ error: "Invalid year format. Please provide a valid number." });
          }

          const newCar = await prisma.car.create({
            data: {
              plate,
              vinNo,
              color,
              make,
              model,
              year: parsedYear, // Ensure it's an integer
            },
          });

          res.status(201).json(newCar);
        } catch (error) {
          res.status(500).json({ error: "Error creating car", details: error.message });
        }
        break;
  
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
