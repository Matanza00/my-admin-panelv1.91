// prisma/seed.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Janitorial Attendance records
  const janitorialAttendances = await prisma.janitorialAttendance.createMany({
    data: [
      {
        supervisor: 'John Doe',
        date: new Date('2024-10-01T08:00:00Z'),
        totalJanitors: 5,
        strength: 4,
        remarks: 'Completed cleaning on time',
      },
      {
        supervisor: 'Jane Smith',
        date: new Date('2024-10-02T08:30:00Z'),
        totalJanitors: 6,
        strength: 6,
        remarks: 'Took longer than usual due to extra cleaning',
      },
      {
        supervisor: 'John Doe',
        date: new Date('2024-10-03T09:00:00Z'),
        totalJanitors: 5,
        strength: 0,
        remarks: 'Absent due to sickness',
      },
      {
        supervisor: 'Emily Johnson',
        date: new Date('2024-10-04T07:30:00Z'),
        totalJanitors: 7,
        strength: 6,
        remarks: 'Routine cleaning',
      },
      {
        supervisor: 'Paul Brown',
        date: new Date('2024-10-05T08:45:00Z'),
        totalJanitors: 5,
        strength: 5,
        remarks: 'Extra cleaning required due to event',
      },
    ],
  });

  console.log('Janitorial Attendance data inserted.');

  // Create Janitor Absences related to Janitorial Attendance records
  await prisma.janitorAbsence.createMany({
    data: [
      {
        name: 'Jane Doe',
        isAbsent: true,
        janitorialAttendanceId: 1,  // Relating to the first Janitorial Attendance record
      },
      {
        name: 'John Smith',
        isAbsent: false,
        janitorialAttendanceId: 2,  // Relating to the second Janitorial Attendance record
      },
      {
        name: 'Emily Brown',
        isAbsent: true,
        janitorialAttendanceId: 3,  // Relating to the third Janitorial Attendance record
      },
      {
        name: 'Paul White',
        isAbsent: false,
        janitorialAttendanceId: 4,  // Relating to the fourth Janitorial Attendance record
      },
      {
        name: 'Sam Green',
        isAbsent: false,
        janitorialAttendanceId: 5,  // Relating to the fifth Janitorial Attendance record
      },
    ],
  });

  console.log('Janitor Absences data inserted.');
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
