import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedJobSlip() {
  await prisma.jobSlip.createMany({
    data: [
      {
        date: new Date('2024-11-02'),
        jobId: "JS1234",
        complainNo: "FC1234",
        complainBy: "John Doe",
        floorNo: "1st Floor",
        area: "Restroom",
        location: "Near the sink",
        complaintDesc: "Water leakage",
        materialReq: "Pipe replacement",
        actionTaken: "Leakage sealed, pipe replaced",
        attendedBy: "Jane Smith",
        remarks: "Problem resolved, no further action needed",
        status: "Completed",
        supervisorApproval: true,
        managementApproval: true,
      },
      {
        date: new Date('2024-11-06'),
        jobId: "JS1235",
        complainNo: "FC1235",
        complainBy: "Alice Brown",
        floorNo: "3rd Floor",
        area: "Office Area",
        location: "Near the window",
        complaintDesc: "AC not cooling",
        materialReq: "AC compressor",
        actionTaken: "Compressor replaced, system serviced",
        attendedBy: "Mike Johnson",
        remarks: "Follow-up scheduled for next week",
        status: "In Progress",
        supervisorApproval: false,
        managementApproval: false,
      },
    ],
  });
}

seedJobSlip()
  .then(() => console.log('JobSlips seeded successfully!'))
  .catch((err) => console.error('Error seeding JobSlip:', err))
  .finally(async () => await prisma.$disconnect());
