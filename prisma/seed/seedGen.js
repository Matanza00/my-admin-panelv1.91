import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data for Generator model
  await prisma.generator.createMany({
    data: [
      {
        date: new Date('2024-11-10'),
        genSetNo: 'G12345',
        power: 'CAT 650kVA',
        capacity: 1000,
        currHrs: 500,
        currDate: new Date('2024-11-10'),
        lastHrs: 450,
        lastDate: new Date('2024-11-05'),
        electricianName: 'John Doe',
        supervisorName: 'Jane Smith',
        engineerName: 'Mark Johnson',
      },
      {
        date: new Date('2024-11-12'),
        genSetNo: 'G67890',
        power: 'CAT 650kVA',
        capacity: 1000,
        currHrs: 400,
        currDate: new Date('2024-11-12'),
        lastHrs: 380,
        lastDate: new Date('2024-11-08'),
        electricianName: 'Alice Brown',
        supervisorName: 'Bob White',
        engineerName: 'Eve Davis',
      },
      {
        date: new Date('2024-11-15'),
        genSetNo: 'G11121',
        power: 'CAT 650kVA',
        capacity: 1000,
        currHrs: 600,
        currDate: new Date('2024-11-15'),
        lastHrs: 580,
        lastDate: new Date('2024-11-10'),
        electricianName: 'Chris Green',
        supervisorName: 'Nina Clark',
        engineerName: 'John White',
      },
    ],
  });

  console.log('Generator records have been seeded!');

  // Seed data for GeneratorFuel model
  await prisma.generatorFuel.createMany({
    data: [
      {
        generatorId: 1,  // Replace with actual Generator ID
        fuelLast: 200,
        fuelConsumed: 100,
        fuelReceived: 150,
        available: 250,
      },
      {
        generatorId: 2,  // Replace with actual Generator ID
        fuelLast: 150,
        fuelConsumed: 80,
        fuelReceived: 120,
        available: 180,
      },
      {
        generatorId: 3,  // Replace with actual Generator ID
        fuelLast: 250,
        fuelConsumed: 120,
        fuelReceived: 180,
        available: 200,
      },
    ],
  });

  console.log('GeneratorFuel records have been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
