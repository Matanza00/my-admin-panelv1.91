import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Fetch all bookings with location data
    const bookings = await prisma.carBooking.findMany({
      include: { car: true },
      orderBy: { bookingDate: "desc" }, // Order by latest bookings first
    });

    // Aggregate bookings by city
    const cityCounts = {};
    bookings.forEach((booking) => {
      const city = booking.location?.split(",")[0]?.trim(); // Extract city name
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    // Convert cityCounts object to array and sort by most booked
    const mostBookedCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Show top 5 most booked cities

    // Get latest 5 bookings
    const latestBookings = bookings.slice(0, 5).map((booking) => ({
      plate: booking.car.plate,
      location: booking.location,
      startTime: booking.bookingDate,
    }));

    return res.status(200).json({ mostBookedCities, latestBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch booking data" });
  }
}
