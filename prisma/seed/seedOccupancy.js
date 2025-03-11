import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOccupancy() {
  await prisma.occupancy.createMany({
    data: [
      {
        tenantId: 1, // Assuming ABC Corp. has tenantId 1
        totalArea: 2500,
        rentedArea: 2400,
        occupancyArea: 2400,
      },
      {
        tenantId: 2, // Assuming XYZ Ltd. has tenantId 2
        totalArea: 1500,
        rentedArea: 1400,
        occupancyArea: 1400,
      },
    ],
  });
}

seedOccupancy()
  .then(() => console.log('Occupancy seeded successfully!'))
  .catch((err) => console.error('Error seeding Occupancy:', err))
  .finally(async () => await prisma.$disconnect());
