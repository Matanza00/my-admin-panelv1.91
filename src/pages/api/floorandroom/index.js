import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all rooms and locations
      if (req.query.type === 'rooms') {
        const rooms = await prisma.room.findMany({
          include: {
            location: true, // Include location info for each room
          },
        });
        return res.status(200).json(rooms);
      } else if (req.query.type === 'locations') {
        const locations = await prisma.location.findMany();
        return res.status(200).json(locations);
      }
      return res.status(400).json({ error: 'Invalid type query' });
    }

    if (req.method === 'POST') {
      // Create a new room or location
      if (req.body.type === 'room') {
        const { roomName, area, locationId, tenantId } = req.body; // Tenant ID is optional
        if (!roomName || !area || !locationId) {
          return res.status(400).json({ error: 'Room name, area, and location are required.' });
        }

        const newRoom = await prisma.room.create({
          data: {
            roomName,
            area,
            locationId: parseInt(locationId),
            tenantId: tenantId || null, // Handle tenant ID being optional
          },
        });
        return res.status(201).json(newRoom);
      } else if (req.body.type === 'location') {
        const { locationName, locationFloor, area, remarks } = req.body; // Adding remarks and area
        if (!locationName || !locationFloor) {
          return res.status(400).json({ error: 'Location name and floor are required.' });
        }

        const newLocation = await prisma.location.create({
          data: {
            locationName,
            locationFloor,
            area,
            remarks: remarks || null, // Handle optional remarks field
          },
        });
        return res.status(201).json(newLocation);
      }
      return res.status(400).json({ error: 'Invalid type in POST body' });
    }

    if (req.method === 'PATCH') {
      // Update room or location
      if (req.body.type === 'room') {
        const { id, locationId, roomName, area, tenantId } = req.body;
        if (!id || !locationId) {
          return res.status(400).json({ error: 'Room ID and location ID are required to update.' });
        }
        console.log(req.body)
        const updatedRoom = await prisma.room.update({
          where: { id: Number(id) },
          data: {
            roomName: roomName || undefined, // If not provided, it won't change
            area: area || undefined,
            locationId: parseInt(locationId),
            tenantId: tenantId || null, // Optional
          },
        });
        return res.status(200).json(updatedRoom);
      } else if (req.body.type === 'location') {
        const { id, locationName, locationFloor, area, remarks } = req.body;
        if (!id || !locationName || !locationFloor) {
          return res.status(400).json({ error: 'Location ID, name, and floor are required to update.' });
        }

        const updatedLocation = await prisma.location.update({
          where: { id: Number(id) },
          data: {
            locationName,
            locationFloor,
            area,
            remarks: remarks || null, // Optional remarks
          },
        });
        return res.status(200).json(updatedLocation);
      }
      return res.status(400).json({ error: 'Invalid type in PATCH body' });
    }

    if (req.method === 'DELETE') {
      // Delete room or location
      if (req.query.type === 'room') {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Room ID is required to delete.' });
        }
        await prisma.room.delete({
          where: { id: Number(id) },
        });
        return res.status(204).end();
      } else if (req.query.type === 'location') {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Location ID is required to delete.' });
        }
        await prisma.location.delete({
          where: { id: Number(id) },
        });
        return res.status(204).end();
      }
      return res.status(400).json({ error: 'Invalid type in DELETE query' });
    }

    // If method is not handled
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
