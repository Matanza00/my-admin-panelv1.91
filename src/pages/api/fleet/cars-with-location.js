import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Fetch all cars from the database
    const cars = await prisma.car.findMany();

    // Fetch real-time fleet car data from the external API
    const response = await fetch(
      "http://116.58.10.83:8181/ios/stateSummaryReport/8275/F,wpr,5TAlrzXcu2SSawoaef0yjstcumdELpkrvEV54=",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Modify if the API requires parameters
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch fleet data. Status: ${response.status}`);
    }

    const fleetData = await response.json(); // Real-time fleet car data

    // Create a map for quick lookup
    const fleetCarMap = new Map(fleetData.map(car => [car.vehRegNo, car]));

    // Function to extract only city and province
    const extractCityProvince = (fullLocation) => {
      if (!fullLocation || typeof fullLocation !== "string") return "Not in API";
      
      // Extract everything after the last comma
      const parts = fullLocation.split(",");
      if (parts.length >= 2) {
        return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`; // Extract last two parts
      }
      return "Not in API";
    };

    // Map cars from database and check for location match
    const updatedCars = cars.map((car) => {
      const matchedFleetCar = fleetCarMap.get(car.plate);

      return {
        ...car, // Include all car details from the database
        location: matchedFleetCar ? extractCityProvince(matchedFleetCar.location) : "Not in API",
      };
    });

    return res.status(200).json(updatedCars);
  } catch (error) {
    console.error("Error fetching car details:", error);
    return res.status(500).json({ error: "Failed to fetch car details" });
  }
}
