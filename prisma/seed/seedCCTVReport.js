import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example: Create a CCTV report
  const report = await prisma.cCTVReport.create({
    data: {
      date: new Date('2024-11-21'),
      time: new Date('2024-11-21T10:00:00Z'),
      remarks: 'Test remarks',
      operationalReport: true,
      cctvOperator: 'John Doe',
      camera: {
        create: [
          { cameraName: 'DVR 1', cameraNo: 'Camera-1', cameraLocation: 'Footpath-West' },
          { cameraName: 'DVR 1', cameraNo: 'Camera-2', cameraLocation: 'Parking-West' },
          { cameraName: 'NVR 1', cameraNo: 'Camera-1', cameraLocation: 'Washroom Gallery-Ground Floor-HRA' },
        ],
      },
    },
  });
  console.log('CCTV Report created:', report);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
