import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid or missing maintenance ID" });
    }

    switch (method) {
        case "GET": 
            try {
                const maintenanceRecord = await prisma.maintenanceRecord.findUnique({
                    where: { id: parseInt(id) },
                    include: { car: true }, // Include car details
                });

                if (!maintenanceRecord) {
                    return res.status(404).json({ error: "Maintenance record not found" });
                }

                res.status(200).json(maintenanceRecord);
            } catch (error) {
                res.status(500).json({ error: "Error fetching maintenance record", details: error.message });
            }
            break;

        case "PUT":
            try {
                const { carId, startDate, endDate, images } = req.body;

                if (!carId || !startDate) {
                    return res.status(400).json({ error: "Missing required fields: carId or startDate" });
                }

                const parsedCarId = parseInt(carId);
                if (isNaN(parsedCarId)) {
                    return res.status(400).json({ error: "Invalid carId" });
                }

                const formattedImages = Array.isArray(images) ? images.join(",") : images;

                const updatedMaintenance = await prisma.maintenanceRecord.update({
                    where: { id: parseInt(id) },
                    data: {
                        carId: parsedCarId,
                        startDate: new Date(startDate),
                        endDate: endDate ? new Date(endDate) : null,
                        images: formattedImages,
                    },
                });

                res.status(200).json(updatedMaintenance);
            } catch (error) {
                res.status(500).json({ error: "Error updating maintenance record", details: error.message });
            }
            break;

        case "DELETE":
            try {
                await prisma.maintenanceRecord.delete({ where: { id: parseInt(id) } });
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "Error deleting maintenance record", details: error.message });
            }
            break;

        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
            res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
