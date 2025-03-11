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

                // Ensure images is stored correctly as a comma-separated string
                const formattedImages = Array.isArray(images) ? images.join(",") : images;

                const newInsurance = await prisma.insurance.create({
                    data: {
                        carId: parsedCarId,
                        startDate: new Date(startDate),
                        endDate: endDate ? new Date(endDate) : null,
                        images: formattedImages,
                    },
                });

                res.status(201).json(newInsurance);
            } catch (error) {
                res.status(500).json({ error: "Error creating insurance record", details: error.message });
            }
            break;

        case "GET":
            try {
                const insuranceRecords = await prisma.insurance.findMany({
                    include: { car: true },
                });
                res.status(200).json(insuranceRecords);
            } catch (error) {
                res.status(500).json({ error: "Error fetching insurance records", details: error.message });
            }
            break;

        default:
            res.setHeader("Allow", ["POST", "GET"]);
            res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
