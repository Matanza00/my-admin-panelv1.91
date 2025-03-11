import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data for FireFighting model
  await prisma.fireFighting.createMany({
    data: [
      {
        date: new Date('2024-11-10'),
        firefighterName: 'John Doe',
        addressableSmokeStatus: true,
        fireAlarmingSystemStatus: true,
        dieselEnginePumpStatus: false,
        wetRisersStatus: true,
        hoseReelCabinetsStatus: false,
        externalHydrantsStatus: true,
        waterStorageTanksStatus: true,
        emergencyLightsStatus: true,
        remarks: 'Routine check, some minor issues with diesel engine pump.',
      },
      {
        date: new Date('2024-11-12'),
        firefighterName: 'Jane Smith',
        addressableSmokeStatus: false,
        fireAlarmingSystemStatus: true,
        dieselEnginePumpStatus: true,
        wetRisersStatus: true,
        hoseReelCabinetsStatus: true,
        externalHydrantsStatus: false,
        waterStorageTanksStatus: true,
        emergencyLightsStatus: false,
        remarks: 'System fully operational, external hydrants need servicing.',
      },
      {
        date: new Date('2024-11-15'),
        firefighterName: 'David Johnson',
        addressableSmokeStatus: true,
        fireAlarmingSystemStatus: false,
        dieselEnginePumpStatus: true,
        wetRisersStatus: false,
        hoseReelCabinetsStatus: true,
        externalHydrantsStatus: true,
        waterStorageTanksStatus: false,
        emergencyLightsStatus: true,
        remarks: 'Emergency lights and hydrants are working, but other systems need attention.',
      },
    ],
  });

  console.log('FireFighting records have been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
