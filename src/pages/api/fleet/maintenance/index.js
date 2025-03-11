import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { carId, startDate, endDate, images } = req.body;

                if (!carId || !startDate) {
                    return res.status(400).json({ error: "Missing required fields: carId or startDate" });
                }

                // Ensure carId is a valid number
                const parsedCarId = parseInt(carId);
                if (isNaN(parsedCarId)) {
                    return res.status(400).json({ error: "Invalid carId" });
                }

                // Ensure images is stored correctly
                const formattedImages = Array.isArray(images) ? images.join(",") : images; 

                const newRecord = await prisma.maintenanceRecord.create({
                    data: {
                        carId: parsedCarId,
                        startDate: new Date(startDate),
                        endDate: endDate ? new Date(endDate) : null,
                        images: formattedImages, // Store as a comma-separated string
                    },
                });

                res.status(201).json(newRecord);
            } catch (error) {
                res.status(500).json({ error: "Error creating maintenance record", details: error.message });
            }
            break;

        case "GET":
            try {
                const records = await prisma.maintenanceRecord.findMany({
                    include: { car: true },
                });
                res.status(200).json(records);
            } catch (error) {
                res.status(500).json({ error: "Error fetching maintenance records", details: error.message });
            }
            break;

        default:
            res.setHeader("Allow", ["POST", "GET"]);
            res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
