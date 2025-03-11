// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create PlumbingProject records
  const project1 = await prisma.plumbingProject.create({
    data: {
      date: new Date(),
      location: "Office Building A",
      plumberName: "John Doe",
      supervisorName: "Jane Smith",
      engineerName: "Michael Johnson",
    },
  });

  const project2 = await prisma.plumbingProject.create({
    data: {
      date: new Date(),
      location: "Residential Complex B",
      plumberName: "Alice Brown",
      supervisorName: "David Green",
      engineerName: "Sarah Lee",
    },
  });

  // Create Location records, linking them to PlumbingProject
  const location1 = await prisma.location.create({
    data: {
      locationName: "Main Floor",
      locationFloor: "1st Floor",
      remarks: "Main office area",
      plumbingProjectId: project1.id,  // Linking to PlumbingProject 1
    },
  });

  const location2 = await prisma.location.create({
    data: {
      locationName: "Top Floor",
      locationFloor: "5th Floor",
      remarks: "Executive offices",
      plumbingProjectId: project1.id,  // Linking to PlumbingProject 1
    },
  });

  const location3 = await prisma.location.create({
    data: {
      locationName: "Ground Floor",
      locationFloor: "Ground",
      remarks: "Lobby and visitor area",
      plumbingProjectId: project2.id,  // Linking to PlumbingProject 2
    },
  });

  // Create Room records, linking them to Location
  const room1 = await prisma.room.create({
    data: {
      roomName: "Conference Room",
      locationId: location1.id,  // Linking to Location 1
    },
  });

  const room2 = await prisma.room.create({
    data: {
      roomName: "Executive Office 1",
      locationId: location2.id,  // Linking to Location 2
    },
  });

  const room3 = await prisma.room.create({
    data: {
      roomName: "Lobby Area",
      locationId: location3.id,  // Linking to Location 3
    },
  });

  // Create PlumbingCheck records, linking them to Room and Location
  await prisma.plumbingCheck.create({
    data: {
      plumbingCheckName: "Basic Check - Conference Room",
      washBasin: true,
      shower: false,
      waterTaps: true,
      commode: true,
      indianWC: false,
      englishWC: true,
      waterFlushKit: true,
      waterDrain: true,
      roomId: room1.id,  // Linking to Room 1
      locationId: location1.id,  // Linking to Location 1
    },
  });

  await prisma.plumbingCheck.create({
    data: {
      plumbingCheckName: "Basic Check - Executive Office 1",
      washBasin: true,
      shower: false,
      waterTaps: true,
      commode: true,
      indianWC: false,
      englishWC: true,
      waterFlushKit: true,
      waterDrain: true,
      roomId: room2.id,  // Linking to Room 2
      locationId: location2.id,  // Linking to Location 2
    },
  });

  await prisma.plumbingCheck.create({
    data: {
      plumbingCheckName: "Basic Check - Lobby Area",
      washBasin: false,
      shower: false,
      waterTaps: true,
      commode: false,
      indianWC: true,
      englishWC: false,
      waterFlushKit: true,
      waterDrain: true,
      roomId: room3.id,  // Linking to Room 3
      locationId: location3.id,  // Linking to Location 3
    },
  });

  console.log("Seed data successfully created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
