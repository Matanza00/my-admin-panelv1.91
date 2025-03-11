import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Define sample security reports
  const securityReports = [
    {
      date: new Date('2024-11-01T09:00:00Z'),
      observedBy: 'John Doe',
      supervisor: 'Jane Smith',
      description: 'Unauthorized entry detected in Zone A.',
      action: 'Alerted security and resolved.',
      timeNoted: new Date('2024-11-01T09:15:00Z'),
      timeSolved: new Date('2024-11-01T09:45:00Z'),
    },
    {
      date: new Date('2024-11-02T14:00:00Z'),
      observedBy: 'Alice Johnson',
      supervisor: 'Robert Brown',
      description: 'Suspicious activity near the main gate.',
      action: 'Monitored the situation and cleared.',
      timeNoted: new Date('2024-11-02T14:10:00Z'),
      timeSolved: new Date('2024-11-02T14:40:00Z'),
    },
    {
      date: new Date('2024-11-03T16:30:00Z'),
      observedBy: 'Michael Green',
      supervisor: 'Laura White',
      description: 'Fire alarm triggered in the storage area.',
      action: 'Evacuated the area and inspected for hazards.',
      timeNoted: new Date('2024-11-03T16:35:00Z'),
      timeSolved: new Date('2024-11-03T17:00:00Z'),
    },
  ];

  console.log('Seeding Security Reports...');

  // Create records in the database
  for (const report of securityReports) {
    await prisma.securityreport.create({
      data: report,
    });
  }

  console.log('Security Reports seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
