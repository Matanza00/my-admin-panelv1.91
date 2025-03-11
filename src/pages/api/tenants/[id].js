import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // Extract tenantId from request body if not available in query
  const tenantId = id ? parseInt(id, 10) : req.body.tenantId;
  console.log(`🔹 Extracted Tenant ID: ${tenantId}`);

  if (!tenantId || isNaN(tenantId)) {
    return res.status(400).json({ error: 'Invalid or missing tenant ID' });
  }

  switch (method) {
    case 'GET':
      try {
        // Fetch tenant details
        const tenant = await prisma.tenants.findUnique({
          where: { id: tenantId },
          include: { area: true },
        });

        if (!tenant) {
          return res.status(404).json({ error: 'Tenant not found' });
        }

        // Fetch user name from `userId`
        let userName = null;
        if (tenant.userId) {
          const user = await prisma.user.findUnique({
            where: { id: tenant.userId },
            select: { name: true }, // Only fetch user name
          });

          userName = user ? user.name : null;
        }

        // Return updated response
        res.status(200).json({
          id: tenant.id,
          tenantName: tenant.tenantName, // Show actual tenant name
          userId: tenant.userId, // Keep userId as is
          userName: userName || 'N/A', // Show user name
          totalAreaSq: tenant.totalAreaSq,
          createdAt: tenant.createdAt.toISOString(),
          updatedAt: tenant.updatedAt.toISOString(),
          area: tenant.area.map((area) => ({
            ...area,
            createdAt: area.createdAt.toISOString(),
            updatedAt: area.updatedAt.toISOString(),
          })),
        });

      } catch (error) {
        console.error('Error fetching tenant:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching tenant' });
      }
      break;
    
      case 'PUT':
  try {
    const { tenantName, totalAreaSq, areas } = req.body;
    console.log(`🔹 PUT Request Received - Tenant ID: ${tenantId}, Data:`, req.body);

    if (!totalAreaSq || !Array.isArray(areas)) {
      return res.status(400).json({ error: 'Invalid input. Ensure all required fields are provided.' });
    }

    // Fetch existing tenant if tenantName is missing
    let existingTenant = await prisma.tenants.findUnique({
      where: { id: tenantId },
      select: { tenantName: true }, // Only fetch tenantName
    });

    if (!existingTenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Use existing tenantName if not provided in request body
    const finalTenantName = tenantName || existingTenant.tenantName;

    const existingAreas = await prisma.area.findMany({
      where: { tenantId },
      select: { id: true },
    });

    const existingAreaIds = existingAreas.map(a => a.id);
    const incomingAreaIds = areas.map(a => a.id).filter(id => id);
    const areasToDelete = existingAreaIds.filter(id => !incomingAreaIds.includes(id));

    if (areasToDelete.length > 0) {
      await prisma.area.deleteMany({ where: { id: { in: areasToDelete } } });
    }

    for (const area of areas) {
      if (area.id) {
        await prisma.area.update({
          where: { id: area.id },
          data: {
            floor: area.floor,
            occupiedArea: parseFloat(area.occupiedArea),
            location: area.location,
          },
        });
      } else {
        await prisma.area.create({
          data: {
            floor: area.floor,
            occupiedArea: parseFloat(area.occupiedArea),
            location: area.location,
            tenantId: tenantId,
          },
        });
      }
    }

    const updatedTenant = await prisma.tenants.update({
      where: { id: tenantId },
      data: { tenantName: finalTenantName, totalAreaSq },
      include: { area: true },
    });

    res.status(200).json(updatedTenant);
  } catch (error) {
    console.error('❌ Error updating tenant:', error);
    res.status(500).json({ error: 'An error occurred while updating tenant', details: error.message });
  }
  break;


    case 'DELETE':
      try {
        console.log(`🔹 DELETE Request Received for Tenant ID: ${tenantId}`);
        await prisma.area.deleteMany({ where: { tenantId } });
        await prisma.occupancy.deleteMany({ where: { tenantId } });
        await prisma.feedbackComplain.deleteMany({ where: { tenantId } });

        const existingTenant = await prisma.tenants.findUnique({
          where: { id: tenantId },
          select: { userId: true },
        });

        if (!existingTenant) {
          return res.status(404).json({ error: 'Tenant not found' });
        }

        if (existingTenant.userId) {
          await prisma.user.delete({ where: { id: existingTenant.userId } });
        }

        await prisma.tenants.delete({ where: { id: tenantId } });

        res.status(200).json({ message: 'Tenant and related data permanently deleted successfully' });
      } catch (error) {
        console.error('❌ Error deleting tenant:', error);
        res.status(500).json({ error: 'Failed to delete tenant', details: error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}
