// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
    await prisma.transformer.createMany({
      data: [
        {
          transformerNo: "T-001",
          lastMaintenance: new Date("2024-10-15"),
          nextMaintenance: new Date("2024-12-15"),
          lastDehydration: new Date("2024-09-10"),
          nextDehydration: new Date("2024-11-10"),
          temp: 75.5,
          voltage: 220.0,
        },
        {
          transformerNo: "T-002",
          lastMaintenance: new Date("2024-08-20"),
          nextMaintenance: new Date("2024-11-20"),
          lastDehydration: new Date("2024-07-30"),
          nextDehydration: new Date("2024-10-30"),
          temp: 80.0,
          voltage: 210.0,
        },
        {
          transformerNo: "T-003",
          lastMaintenance: new Date("2024-09-25"),
          nextMaintenance: new Date("2024-12-25"),
          lastDehydration: new Date("2024-06-10"),
          nextDehydration: new Date("2024-09-10"),
          temp: 70.0,
          voltage: 230.0,
        },
      ],
    });
  }
  
  main()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  