import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  switch (method) {
    case "PUT":
      try {
        const { driverId } = req.body;

        if (!driverId) return res.status(400).json({ error: "Driver ID is required" });

        const updatedCar = await prisma.car.update({
          where: { id: parseInt(id) },
          data: { driverId },
        });

        return res.status(200).json(updatedCar);
      } catch (error) {
        console.error("Error assigning driver:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
}
