import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const report1 = await prisma.fCUReport.create({
    data: {
      date: new Date(),
      remarks: 'Routine maintenance check',
      supervisorApproval: true,
      engineerApproval: false,
      floorFCs: {
        create: [
          {
            floorFrom: '1',
            floorTo: '2',
            details: 'FCU 1A inspection',
            verifiedBy: 'Jane Doe',
            attendedBy: 'John Doe',
          },
          {
            floorFrom: '3',
            floorTo: '4',
            details: 'FCU 2B inspection',
            verifiedBy: 'John Doe',
            attendedBy: 'Jane Doe',
          },
        ],
      },
    },
  });

  const report2 = await prisma.fCUReport.create({
    data: {
      date: new Date(),
      remarks: 'System upgrade maintenance',
      supervisorApproval: true,
      engineerApproval: true,
      floorFCs: {
        create: [
          {
            floorFrom: '5',
            floorTo: '6',
            details: 'FCU 3A upgrade',
            verifiedBy: 'Bob Smith',
            attendedBy: 'Alice Brown',
          },
          {
            floorFrom: '7',
            floorTo: '8',
            details: 'FCU 4B upgrade',
            verifiedBy: 'Alice Brown',
            attendedBy: 'Bob Smith',
          },
        ],
      },
    },
  });

  console.log('Seed data created: FCUReports and associated FloorFCs');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
