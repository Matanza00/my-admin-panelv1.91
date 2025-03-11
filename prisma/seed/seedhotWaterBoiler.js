import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a hot water boiler entry
  const boiler = await prisma.hotWaterBoiler.create({
    data: {
      StartTime: new Date(),
      ShutdownTime: new Date(),
      Remarks: 'Routine maintenance',
      OperatorName: 'John Doe',
      SupervisorName: 'Jane Smith',
      EngineerName: 'Alan Turing',
      TimeHr: {
        create: [
          {
            HotWaterIn: 50,
            HotWaterOut: 45,
            ExhaustTemp: 120,
            FurnacePressure: 15,
            assistantSupervisor: 'Bob Brown', // Assistant Supervisor
          },
          {
            HotWaterIn: 55,
            HotWaterOut: 50,
            ExhaustTemp: 110,
            FurnacePressure: 16,
            assistantSupervisor: 'Alice Green', // Assistant Supervisor
          },
        ],
      },
    },
  });

  console.log('Hot Water Boiler and TimeHr data created:', boiler);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
