import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      // Fetch the transformer by ID
      const transformer = await prisma.transformer.findUnique({
        where: { id: parseInt(id) },
      });

      if (!transformer) {
        return res.status(404).json({ error: "Transformer not found" });
      }

      // Fetch the engineer name for the transformer
      const engineer = transformer.engineer
        ? await prisma.user.findUnique({
            where: { id: transformer.engineer },
            select: { name: true },
          })
        : null;

      // Fetch the most recent previous transformer entry
      const previousTransformer = await prisma.transformer.findFirst({
        where: { id: { lt: parseInt(id) } },
        orderBy: { id: "desc" },
      });

      return res.status(200).json({
        transformer: {
          ...transformer,
          engineerName: engineer?.name || "Unknown", // Add engineer name
        },
        previousTransformer,
      });
    } catch (error) {
      console.error("Error fetching transformer:", error);
      return res.status(500).json({ error: "Failed to fetch transformer data" });
    }
  } else if (req.method === "PUT") {
    try {
      const {
        transformerNo,
        nextMaintenance,
        nextDehydration,
        temp,
        HTvoltage,
        LTvoltage,
        HTStatus,
        LTStatus,
        engineerId,
      } = req.body;
      console.log(req.body)
      // Validate inputs
      if (!transformerNo) {
        return res.status(400).json({ error: "Transformer No is required" });
      }

      if (!engineerId || isNaN(parseInt(engineerId))) {
        return res.status(400).json({ error: "Valid Engineer ID is required" });
      }

      // Calculate status for temp (tempStatus)
      const tempStatus = temp < 40 ? "Low" : temp > 50 ? "High" : "Normal";

      // Update the transformer
      const updatedTransformer = await prisma.transformer.update({
        where: { id: parseInt(id) },
        data: {
          transformerNo,
          nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
          nextDehydration: nextDehydration ? new Date(nextDehydration) : null,
          temp: temp ? parseFloat(temp) : null,
          HTvoltage: HTvoltage ? parseFloat(HTvoltage) : null,
          LTvoltage: LTvoltage ? parseFloat(LTvoltage) : null,
          HTStatus: HTStatus ? HTStatus : null,
          LTStatus: LTStatus ? LTStatus : null,
          tempStatus, // Save calculated temp status
          engineer: parseInt(engineerId), // Save engineer ID
        },
      });

      return res.status(200).json(updatedTransformer);
    } catch (error) {
      console.error("Error updating transformer:", error);
      return res.status(500).json({ error: "Failed to update transformer data" });
    }
}  else if (req.method === "DELETE") {
  try {
    // Delete the transformer by ID
    const deletedTransformer = await prisma.transformer.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Transformer deleted successfully", deletedTransformer });
  } catch (error) {
    console.error("Error deleting transformer:", error);
    return res.status(500).json({ error: "Failed to delete transformer" });
  }
} else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
