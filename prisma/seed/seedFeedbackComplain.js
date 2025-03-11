import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed tenants
  const tenant1 = await prisma.tenants.upsert({
    where: { tenantName: 'Alfalah Asset Management' },  // Ensure tenantName is unique in your schema
    update: {
      totalAreaSq: 5000,
    },
    create: {
      tenantName: 'Alfalah Asset Management',
      totalAreaSq: 5000,
    },
  });

  const tenant2 = await prisma.tenants.upsert({
    where: { tenantName: 'XYZ Real Estate' },  // Ensure tenantName is unique in your schema
    update: {
      totalAreaSq: 3000,
    },
    create: {
      tenantName: 'XYZ Real Estate',
      totalAreaSq: 3000,
    },
  });

  // Seed areas with correct tenant associations
  const area1 = await prisma.area.upsert({
    where: { id: 1 },
    update: {
      floor: '1',
      occupiedArea: 2500,
      location: 'Main Lobby',
      tenantId: tenant1.id, // Correct association using tenantId
    },
    create: {
      floor: '1',
      occupiedArea: 2500,
      location: 'Main Lobby',
      tenantId: tenant1.id, // Correct association using tenantId
    },
  });

  const area2 = await prisma.area.upsert({
    where: { id: 2 },
    update: {
      floor: '2',
      occupiedArea: 1500,
      location: 'Conference Room',
      tenantId: tenant2.id, // Correct association using tenantId
    },
    create: {
      floor: '2',
      occupiedArea: 1500,
      location: 'Conference Room',
      tenantId: tenant2.id, // Correct association using tenantId
    },
  });

  // Seed FeedbackComplaints with correct area references
  const feedback1 = await prisma.feedbackComplain.upsert({
    where: { complainNo: 'C001' },
    update: {
      complain: 'Water leakage in lobby',
      date: new Date(),
      complainBy: 'John Doe',
      floorNo: '1',
      areaId: area1.id, // Correct reference to areaId
      location: 'Near elevator',
      listServices: 'Plumbing',
      materialReq: 'PVC pipes',
      actionTaken: 'Repair completed',
      attendedBy: 'Technician A',
      remarks: 'Issue resolved',
      status: 'Closed',
      tenantId: tenant1.id,
    },
    create: {
      complain: 'Water leakage in lobby',
      date: new Date(),
      complainNo: 'C001',
      complainBy: 'John Doe',
      floorNo: '1',
      areaId: area1.id, // Correct reference to areaId
      location: 'Near elevator',
      listServices: 'Plumbing',
      materialReq: 'PVC pipes',
      actionTaken: 'Repair completed',
      attendedBy: 'Technician A',
      remarks: 'Issue resolved',
      status: 'Closed',
      tenantId: tenant1.id,
    },
  });

  const feedback2 = await prisma.feedbackComplain.upsert({
    where: { complainNo: 'C002' },
    update: {
      complain: 'Broken light in parking area',
      date: new Date(),
      complainBy: 'Jane Smith',
      floorNo: '-1',
      areaId: area2.id, // Correct reference to areaId
      location: 'Lot B',
      listServices: 'Electrical',
      materialReq: 'Light bulbs',
      actionTaken: 'Pending',
      attendedBy: 'Technician B',
      remarks: 'To be resolved',
      status: 'Open',
      tenantId: tenant2.id,
    },
    create: {
      complain: 'Broken light in parking area',
      date: new Date(),
      complainNo: 'C002',
      complainBy: 'Jane Smith',
      floorNo: '-1',
      areaId: area2.id, // Correct reference to areaId
      location: 'Lot B',
      listServices: 'Electrical',
      materialReq: 'Light bulbs',
      actionTaken: 'Pending',
      attendedBy: 'Technician B',
      remarks: 'To be resolved',
      status: 'Open',
      tenantId: tenant2.id,
    },
  });

  // Seed JobSlips, referencing the feedback complaints correctly
  const jobSlip1 = await prisma.jobSlip.upsert({
    where: { jobId: 'J001' },
    update: {
      date: new Date(),
      complainNo: feedback1.complainNo,
      complainBy: feedback1.complainBy,
      floorNo: feedback1.floorNo,
      areaId: feedback1.areaId, // Correct reference to areaId
      location: feedback1.location,
      complaintDesc: feedback1.complain,
      materialReq: feedback1.materialReq,
      actionTaken: feedback1.actionTaken,
      attendedBy: feedback1.attendedBy,
      remarks: feedback1.remarks,
      status: 'Completed',
      supervisorApproval: true,
      managementApproval: true,
    },
    create: {
      date: new Date(),
      jobId: 'J001',
      complainNo: feedback1.complainNo,
      complainBy: feedback1.complainBy,
      floorNo: feedback1.floorNo,
      areaId: feedback1.areaId, // Correct reference to areaId
      location: feedback1.location,
      complaintDesc: feedback1.complain,
      materialReq: feedback1.materialReq,
      actionTaken: feedback1.actionTaken,
      attendedBy: feedback1.attendedBy,
      remarks: feedback1.remarks,
      status: 'Completed',
      supervisorApproval: true,
      managementApproval: true,
    },
  });

  const jobSlip2 = await prisma.jobSlip.upsert({
    where: { jobId: 'J002' },
    update: {
      date: new Date(),
      complainNo: feedback2.complainNo,
      complainBy: feedback2.complainBy,
      floorNo: feedback2.floorNo,
      areaId: feedback2.areaId, // Correct reference to areaId
      location: feedback2.location,
      complaintDesc: feedback2.complain,
      materialReq: feedback2.materialReq,
      actionTaken: feedback2.actionTaken,
      attendedBy: feedback2.attendedBy,
      remarks: feedback2.remarks,
      status: 'Pending',
      supervisorApproval: false,
      managementApproval: false,
    },
    create: {
      date: new Date(),
      jobId: 'J002',
      complainNo: feedback2.complainNo,
      complainBy: feedback2.complainBy,
      floorNo: feedback2.floorNo,
      areaId: feedback2.areaId, // Correct reference to areaId
      location: feedback2.location,
      complaintDesc: feedback2.complain,
      materialReq: feedback2.materialReq,
      actionTaken: feedback2.actionTaken,
      attendedBy: feedback2.attendedBy,
      remarks: feedback2.remarks,
      status: 'Pending',
      supervisorApproval: false,
      managementApproval: false,
    },
  });
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
