import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
      case "GET":
        try {
          const car = await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: {
              maintenanceRecords: true, // Include maintenance history
              insurances: true, // Include insurance records
            }, // Removed `driver` from response
          });

          if (!car) {
            return res.status(404).json({ error: "Car not found" });
          }

          res.status(200).json(car);
        } catch (error) {
          res.status(500).json({ error: "Error fetching car", details: error.message });
        }
        break;

      case "PUT":
        try {
          const { plate, vinNo, color, make, model, year } = req.body; // Removed `driverId`

          const updatedCar = await prisma.car.update({
            where: { id: parseInt(id) },
            data: { 
              plate, 
              vinNo, 
              color, 
              make, 
              model, 
              year: parseInt(year, 10), // Ensure `year` is stored as an integer
            },
          });

          res.status(200).json(updatedCar);
        } catch (error) {
          res.status(500).json({ error: "Error updating car", details: error.message });
        }
        break;

      case "DELETE":
        try {
          const carId = parseInt(id);

          // Check if the car exists
          const car = await prisma.car.findUnique({
            where: { id: carId },
            include: {
              maintenanceRecords: true,
              insurances: true,
            },
          });

          if (!car) {
            return res.status(404).json({ error: "Car not found" });
          }

          // Delete related Maintenance Records
          await prisma.maintenanceRecord.deleteMany({
            where: { carId: carId },
          });

          // Delete related Insurance Records
          await prisma.insurance.deleteMany({
            where: { carId: carId },
          });

          // Now, delete the car
          await prisma.car.delete({
            where: { id: carId },
          });

          res.status(204).end();
        } catch (error) {
          console.error("Error deleting car:", error);
          res.status(500).json({ error: "Error deleting car", details: error.message });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
