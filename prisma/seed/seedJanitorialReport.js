// seedJanitorialReport.js
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

dotenv.config();
async function seedJanitorialReports() {
  try {
    // Sample data for Janitorial Reports
    const janitorialReports = [
      {
        date: new Date('2024-11-10'),
        supervisor: "John Doe",
        tenant: "Tenant A",
        remarks: "Overall clean",
        subJanReport: {
          create: [
            {
              floorNo: "1",
              toilet: "Cleaned",
              lobby: "Cleaned",
              staircase: "Dusty"
            },
            {
              floorNo: "2",
              toilet: "Cleaned",
              lobby: "Requires attention",
              staircase: "Cleaned"
            },
          ],
        },
      },
      {
        date: new Date('2024-11-11'),
        supervisor: "Jane Smith",
        tenant: "Tenant B",
        remarks: "Regular maintenance",
        subJanReport: {
          create: [
            {
              floorNo: "3",
              toilet: "Requires cleaning",
              lobby: "Cleaned",
              staircase: "Cleaned"
            },
          ],
        },
      },
      {
        date: new Date('2024-11-12'),
        supervisor: "Mike Johnson",
        tenant: "Tenant C",
        remarks: null,
        subJanReport: {
          create: [
            {
              floorNo: "1",
              toilet: "Cleaned",
              lobby: "Cleaned",
              staircase: "Cleaned"
            },
            {
              floorNo: "4",
              toilet: "Needs repair",
              lobby: "Dusty",
              staircase: "Requires cleaning"
            },
          ],
        },
      },
    ];

    // Insert data
    for (const report of janitorialReports) {
      await prisma.janitorialReport.create({
        data: report,
      });
    }

    console.log("Seeding Janitorial reports completed successfully.");
  } catch (error) {
    console.error("Error seeding Janitorial reports:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedJanitorialReports();
