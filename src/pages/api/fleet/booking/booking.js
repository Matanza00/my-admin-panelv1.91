import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { fromDate } = req.query; // Get the selected date from query params

    let bookings;
    if (fromDate) {
      bookings = await prisma.carBooking.findMany({
        where: {
          bookingDate: {
            gte: new Date(fromDate), // Fetch bookings from selected date to today
          },
        },
        include: { car: true, driver: true },
        orderBy: { bookingDate: "desc" }, // Order by newest first
      });
    } else {
      bookings = await prisma.carBooking.findMany({
        include: { car: true, driver: true },
        orderBy: { bookingDate: "desc" },
      });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
}
