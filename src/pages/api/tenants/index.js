import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': // Fetch all tenants
      try {
        const tenants = await prisma.tenants.findMany({
          where: {
            deletedAt: null, // 🚨 Restrict tenants that are NOT soft deleted
          },
          include: { area: true }, // Ensure this matches your schema
        });
        

        // 🛠 Fix: Query users by `tenantName` instead of treating it as an ID
        const userNames = tenants.map((tenant) => tenant.tenantName); // Extract tenant names
        console.log("🔹 Tenant Names from DB:", userNames);

        const users = await prisma.user.findMany({
          where: { name: { in: userNames } },  // Match names, not IDs
          select: { id: true, name: true },
        });

        console.log("🔹 Users Fetched:", users);

        // Create a map for quick user lookup
        const userMap = users.reduce((acc, user) => {
          acc[user.name] = user.id; // Map user name to user ID
          return acc;
        }, {});

        const response = tenants.map((tenant) => ({
          ...tenant,
          tenantUserId: userMap[tenant.tenantName] || null, // Map tenantName to userId
          createdAt: tenant.createdAt.toISOString(),
          updatedAt: tenant.updatedAt.toISOString(),
          area: tenant.area.map((area) => ({
            ...area,
            createdAt: area.createdAt.toISOString(),
            updatedAt: area.updatedAt.toISOString(),
          })),
        }));

        res.status(200).json({ data: response });
      } catch (error) {
        console.error('❌ Error fetching tenants:', error);
        res.status(500).json({ error: 'Failed to fetch tenants' });
      }
      break;
  
    case 'POST': // Add a new tenant
      try {
        const { tenantName,userId, totalAreaSq, areas } = req.body;
        console.log(req.body)

        // Validation
        if (!tenantName || totalAreaSq === undefined || !Array.isArray(areas)) {
          return res.status(400).json({ error: 'Invalid input' });
        }

        // Validate individual area entries
        for (const area of areas) {
          if (!area.floor || area.occupiedArea === undefined) {
            return res.status(400).json({ error: 'Invalid area data' });
          }
        }

        const newTenant = await prisma.tenants.create({
          data: {
            tenantName,
            totalAreaSq,
            area: {
              create: areas.map((area) => ({
                floor: area.floor,
                occupiedArea: parseFloat(area.occupiedArea),
                location: area.location,
              })),
            },
          },
          include: { area: true },
        });

        res.status(201).json({
          ...newTenant,
          createdAt: newTenant.createdAt.toISOString(),
          updatedAt: newTenant.updatedAt.toISOString(),
          area: newTenant.area.map((area) => ({
            ...area,
            createdAt: area.createdAt.toISOString(),
            updatedAt: area.updatedAt.toISOString(),
          })),
        });
      } catch (error) {
        console.error('Error adding tenant:', error.message);
        res.status(500).json({ error: 'Failed to add tenant' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
