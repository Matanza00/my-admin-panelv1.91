import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Roles
  const roles = await prisma.role.createMany({
    data: [
      { name: 'Firefighter' },
      { name: 'Supervisor' },
    ],
  });

  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', username: 'alice123', password: 'password123', department: 'Fire Department', roleId: 1 },
      { name: 'Bob', email: 'bob@example.com', username: 'bob123', password: 'password123', department: 'Fire Department', roleId: 1 },
      { name: 'Charlie', email: 'charlie@example.com', username: 'charlie123', password: 'password123', department: 'Fire Department', roleId: 2 },
    ],
  });

  // Seed Firefighting Duties
  const duty1 = await prisma.firefightingDuty.create({
    data: {
      date: new Date('2024-11-20'),
      shift: 'Morning',
      users: {
        connect: [
          { id: 1 }, // Alice
          { id: 2 }, // Bob
        ],
      },
    },
  });

  const duty2 = await prisma.firefightingDuty.create({
    data: {
      date: new Date('2024-11-20'),
      shift: 'Evening',
      users: {
        connect: [
          { id: 1 }, // Alice
          { id: 3 }, // Charlie
        ],
      },
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
