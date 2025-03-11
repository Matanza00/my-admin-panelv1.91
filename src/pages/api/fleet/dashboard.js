import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
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

    const fleetData = await response.json(); // Vehicles from API

    const cars = [];

    // Loop through each vehicle received
    for (const vehicle of fleetData) {
      const { vehRegNo, lat, lng, recDateTime, status , location } = vehicle;

      // Check if car already exists in the database
      let car = await prisma.car.findUnique({
        where: { plate: vehRegNo },
      });

      if (!car) {
        // If car does not exist, create a new entry
        car = await prisma.car.create({
          data: {
            plate: vehRegNo,
            vinNo: String(vehRegNo), // Using the same as ID for now
            color: String(vehRegNo),
            make: String(vehRegNo),
            model: String(vehRegNo),
            year: parseInt(vehRegNo.replace(/\D/g, "")) || 0, // Extract number if present
          },
        });
      }

      // Add car data to response array
      cars.push({
        plate: car.plate,
        vinNo: car.vinNo,
        color: car.color,
        make: car.make,
        model: car.model,
        year: car.year,
        lat,
        lng,
        recDateTime,
        status,
        location,
      });
    }

    return res.status(200).json(cars);
  } catch (error) {
    console.error("Error in fetching or inserting fleet data:", error);
    return res.status(500).json({ error: "Failed to fetch or insert fleet data" });
  }
}
