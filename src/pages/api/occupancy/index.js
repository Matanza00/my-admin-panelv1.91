import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Fetch all tenants with their related areas
    const tenants = await prisma.tenants.findMany({
      include: {
        area: true, // Correct the field name from 'areas' to 'area'
      },
    });

    res.status(200).json({ data: tenants });
  } catch (error) {
    console.error('Error fetching tenants data:', error);
    res.status(500).json({ error: 'Failed to fetch tenants data' });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}
