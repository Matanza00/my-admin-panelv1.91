import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a hot water boiler entry
  const boiler = await prisma.absorbtionChiller.create({
    data: {
      StartTime: new Date(),
      ShutdownTime: new Date(),
      Remarks: 'Routine maintenance',
      OperatorName: 'John Doe',
      SupervisorName: 'Jane Smith',
      EngineerName: 'Alan Turing',
      Chillers: {
        create: [
          {
            ColdWaterIn: 50,
            ColdWaterOut: 45,
            ChillingWaterIn: 120,
            ChillingWaterOut: 15,
            assistantSupervisor: 'Bob Brown', // Assistant Supervisor
          },
          {
            ColdWaterIn: 55,
            ColdWaterOut: 50,
            ChillingWaterIn: 110,
            ChillingWaterOut: 16,
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
