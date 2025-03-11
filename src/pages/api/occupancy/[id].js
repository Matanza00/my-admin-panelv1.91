// pages/api/occupancy/[id].js
import { PrismaClient } from '@prisma/client';  // Import PrismaClient

const prisma = new PrismaClient();  // Instantiate PrismaClient

// Handler for GET, PUT, DELETE methods
export default async function handler(req, res) {
  const { id } = req.query; // Get the occupancy ID from the URL

  if (req.method === 'GET') {
    try {
      // Fetch the occupancy record by ID
      const occupancy = await prisma.occupancy.findUnique({
        where: { id: parseInt(id) }, // Parse the ID to an integer
        include: {
          tenant: true, // Include related tenant data
        },
      });

      if (!occupancy) {
        return res.status(404).json({ error: 'Occupancy not found' }); // Return 404 if the occupancy doesn't exist
      }

      res.status(200).json(occupancy); // Return the found occupancy record
    } catch (error) {
      console.error('Error fetching occupancy:', error);
      res.status(500).json({ error: 'Failed to fetch occupancy' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { tenantId, totalArea, rentedArea, occupancyArea } = req.body;

      // Ensure all necessary fields are present
      if (!tenantId || !totalArea || !rentedArea || !occupancyArea) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Update the occupancy record
      const updatedOccupancy = await prisma.occupancy.update({
        where: { id: parseInt(id) }, // Find the occupancy by ID
        data: {
          tenantId,
          totalArea,
          rentedArea,
          occupancyArea,
        },
      });

      res.status(200).json(updatedOccupancy); // Return the updated occupancy record
    } catch (error) {
      console.error('Error updating occupancy:', error);
      res.status(500).json({ error: 'Failed to update occupancy' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the occupancy record by ID
      const deletedOccupancy = await prisma.occupancy.delete({
        where: { id: parseInt(id) }, // Find the occupancy by ID
      });

      res.status(200).json(deletedOccupancy); // Return the deleted occupancy record
    } catch (error) {
      console.error('Error deleting occupancy:', error);
      res.status(500).json({ error: 'Failed to delete occupancy' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }); // If the method is neither GET, PUT, nor DELETE
  }

  await prisma.$disconnect(); // Disconnect Prisma client after request
}
