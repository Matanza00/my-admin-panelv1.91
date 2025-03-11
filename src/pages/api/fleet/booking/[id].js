import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const booking = await prisma.carBooking.findUnique({
          where: { id: parseInt(id) },
          include: { car: true, driver: true },
        });

        if (!booking) {
          return res.status(404).json({ error: "Booking not found" });
        }

        return res.status(200).json(booking);
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch booking", details: error.message });
      }

    case "PUT":
      try {
        const { endTime, odometerEnd, cost } = req.body;

        const booking = await prisma.carBooking.findUnique({ where: { id: parseInt(id) } });
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        const distanceTraveled = odometerEnd - booking.odometerStart;

        const updatedBooking = await prisma.carBooking.update({
          where: { id: parseInt(id) },
          data: {
            endTime: new Date(endTime),
            odometerEnd,
            distanceTraveled,
            cost,
            status: endTime ? "COMPLETED" : "BOOKED", // ✅ Auto-update status
          },
        });

        return res.status(200).json(updatedBooking);
      } catch (error) {
        return res.status(500).json({ error: "Failed to update booking", details: error.message });
      }

    case "DELETE":
      try {
        await prisma.carBooking.delete({
          where: { id: parseInt(id) },
        });

        return res.status(204).end();
      } catch (error) {
        return res.status(500).json({ error: "Failed to delete booking", details: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
