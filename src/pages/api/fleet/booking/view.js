import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Fetch all active bookings
    const bookings = await prisma.carBooking.findMany({
      include: { car: true, driver: true },
    });

    // Fetch vehicle data from the external fleet API
    const response = await fetch(
      "http://116.58.10.83:8181/ios/stateSummaryReport/8275/F,wpr,5TAlrzXcu2SSawoaef0yjstcumdELpkrvEV54=",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Adjust if API requires payload
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch fleet data. Status: ${response.status}`);
    }

    const fleetData = await response.json(); // Real-time vehicle data

    // Match bookings with real-time vehicle data
    const updatedBookings = bookings.map((booking) => {
      const matchedVehicle = fleetData.find(
        (vehicle) => vehicle.vehRegNo === booking.car.plate
      );

      return {
        ...booking,
        vehicleData: matchedVehicle
          ? {
              vehRegNo: matchedVehicle.vehRegNo,
              lat: matchedVehicle.lat,
              lng: matchedVehicle.lng,
              status: matchedVehicle.status,
              location: matchedVehicle.location,
              recDateTime: matchedVehicle.recDateTime,
            }
          : null, // No matching vehicle found
      };
    });

    return res.status(200).json(updatedBookings);
  } catch (error) {
    console.error("Error fetching booking data:", error);
    return res.status(500).json({ error: "Failed to fetch booking details" });
  }
}
