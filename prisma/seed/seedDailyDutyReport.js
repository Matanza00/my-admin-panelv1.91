import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Daily Duty Reports...');

  const dailyDutyReports = [
    {
      date: new Date('2024-11-15'),
      shift: 'Morning',
      supervisor: 'John Doe',
      userSec: [
        {
          name: 'Alice Smith',
          designation: 'Security Guard',
          timeIn: new Date('2024-11-15T08:00:00Z'),
          timeOut: new Date('2024-11-15T16:00:00Z'),
          location: 'Gate 1',
          userId: 'USR001',
        },
        {
          name: 'Bob Johnson',
          designation: 'Security Guard',
          timeIn: new Date('2024-11-15T08:30:00Z'),
          timeOut: new Date('2024-11-15T16:30:00Z'),
          location: 'Gate 2',
          userId: 'USR002',
        },
      ],
    },
    {
      date: new Date('2024-11-16'),
      shift: 'Night',
      supervisor: 'Jane Smith',
      userSec: [
        {
          name: 'Charlie Brown',
          designation: 'Night Watchman',
          timeIn: new Date('2024-11-16T22:00:00Z'),
          timeOut: new Date('2024-11-17T06:00:00Z'),
          location: 'Main Building',
          userId: 'USR003',
        },
        {
          name: 'Daisy White',
          designation: 'Security Guard',
          timeIn: new Date('2024-11-16T22:30:00Z'),
          timeOut: new Date('2024-11-17T05:30:00Z'),
          location: 'Parking Lot',
          userId: 'USR004',
        },
      ],
    },
  ];

  for (const report of dailyDutyReports) {
    // Create the daily duty report first
    const createdReport = await prisma.dailydutyreport.create({
      data: {
        date: report.date,
        shift: report.shift,
        supervisor: report.supervisor,
      },
    });

    // Create associated usersec entries for the report
    for (const userSec of report.userSec) {
      await prisma.usersec.create({
        data: {
          ...userSec,
          dailyDutyId: createdReport.id, // Link the usersec to the created daily duty report
        },
      });
    }
  }

  console.log('Daily Duty Reports seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
