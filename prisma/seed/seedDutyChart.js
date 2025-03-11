import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Duty Charts
  const dutyChart1 = await prisma.dutyChart.create({
    data: {
      date: new Date('2024-11-23'),
      supervisor: 'John Doe',
      remarks: 'Regular duty schedule',
      picture: 'https://example.com/pictures/dutychart1.jpg',
      attendance: {
        create: [
          {
            name: 'Alice Smith',
            designation: 'Technician',
            timeIn: new Date('2024-11-23T09:00:00Z'),
            timeOut: new Date('2024-11-23T17:00:00Z'),
            lunchIn: new Date('2024-11-23T12:00:00Z'),
            lunchOut: new Date('2024-11-23T12:30:00Z'),
          },
          {
            name: 'Bob Johnson',
            designation: 'Supervisor',
            timeIn: new Date('2024-11-23T08:30:00Z'),
            timeOut: new Date('2024-11-23T17:30:00Z'),
          },
        ],
      },
    },
  });

  const dutyChart2 = await prisma.dutyChart.create({
    data: {
      date: new Date('2024-11-24'),
      supervisor: 'Jane Doe',
      remarks: 'Weekend duty schedule',
      picture: null,
      attendance: {
        create: [
          {
            name: 'Charlie Brown',
            designation: 'Manager',
            timeIn: new Date('2024-11-24T10:00:00Z'),
            timeOut: new Date('2024-11-24T15:00:00Z'),
          },
        ],
      },
    },
  });

  console.log({ dutyChart1, dutyChart2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
