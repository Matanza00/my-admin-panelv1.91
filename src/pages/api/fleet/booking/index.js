import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const { fromDate } = req.query; // Fetch filter date if provided

        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

        console.log("Fetching booking analytics...");

        // Fetch all bookings, optionally filtering by date
        const bookings = await prisma.carBooking.findMany({
          where: fromDate
            ? {
                startTime: {
                  gte: new Date(fromDate), // Filter bookings from selected date onwards
                },
              }
            : {},
          include: {
            car: true,
            driver: true,
          },
          orderBy: { startTime: "desc" },
        });

        console.log(`Total bookings fetched: ${bookings.length}`);

        // 1️⃣ Count how many times each car is booked
        const carBookingCounts = {};
        const driverBookingCounts = {};
        let weeklySpent = 0;
let monthlySpent = 0;
let totalSpent = 0;

const now = new Date();
const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

bookings.forEach(({ car, driver, cost = 0, startTime }) => {
  const bookingDate = new Date(startTime);
  const bookingCost = parseFloat(cost) || 0;

  // Count Cars
  if (car?.plate) {
    carBookingCounts[car.plate] = (carBookingCounts[car.plate] || 0) + 1;
  }

  // Count Drivers
  if (driver?.name) {
    driverBookingCounts[driver.name] = (driverBookingCounts[driver.name] || 0) + 1;
  }

  // Calculate Cost Metrics
  totalSpent += bookingCost;
  if (bookingDate >= oneWeekAgo) weeklySpent += bookingCost;
  if (bookingDate >= oneMonthAgo) monthlySpent += bookingCost;
});


        // 2️⃣ Convert to array & sort by highest booking count
        const mostBookedCars = Object.entries(carBookingCounts)
          .map(([plate, count]) => ({ plate, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Only Top 5 Cars

        // 3️⃣ Top 5 Drivers
        const topDrivers = Object.entries(driverBookingCounts)
          .map(([driver, count]) => ({ driver, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Only Top 5 Drivers

        // 4️⃣ Get latest 5 bookings
        const latestBookings = bookings.slice(0, 5).map((booking) => ({
          plate: booking.car?.plate || "Unknown",
          location: booking.location || "Not Available",
          startTime: booking.startTime,
        }));

        return res.status(200).json({
          bookings,
          mostBookedCars,
          topDrivers,
          latestBookings,
          weeklySpent,
          monthlySpent,
          totalSpent,
        });
      } catch (error) {
        console.error("🚨 GET Booking Error:", error);
        return res.status(500).json({ error: "Failed to fetch booking analytics", details: error.message });
      }

        
      
    case "POST":
      try {
        let { carId, driverId, startTime, odometerStart } = req.body;

        // ✅ Convert `carId`, `driverId`, and `odometerStart` to Integers
        carId = parseInt(carId, 10);
        driverId = parseInt(driverId, 10);
        odometerStart = parseInt(odometerStart, 10);

        // ✅ Validation: Ensure fields are present and correctly formatted
        if (!carId || !driverId || !startTime || isNaN(odometerStart)) {
          return res.status(400).json({ error: "Invalid or missing required fields" });
        }

        const booking = await prisma.carBooking.create({
          data: {
            carId,
            driverId,
            startTime: new Date(startTime),
            odometerStart,
          },
        });

        return res.status(201).json(booking);
      } catch (error) {
        console.error("Booking Creation Error:", error);
        return res.status(500).json({ error: "Failed to create booking", details: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
