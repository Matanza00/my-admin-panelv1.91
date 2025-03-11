import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a water management record
  const waterManagement = await prisma.waterManagement.create({
    data: {
      title: 'Water Supply System A',
      description: 'Description of the water management system.',
      supervisorName: 'John Doe',
      operatorName: 'Jane Smith',
      engineerName: 'Alice Johnson',
      pumps: {
        create: [
          {
            name: 'Pump 1',
            capacity: 50.5,
            horsepower: 150,
            location: 'Location A',
            checks: {
              create: [
                {
                  waterSealStatus: 'Good',
                  pumpBearingStatus: 'Normal',
                  motorBearingStatus: 'Normal',
                  rubberCouplingStatus: 'Good',
                  pumpImpellerStatus: 'Normal',
                  mainValvesStatus: 'Operational',
                  motorWindingStatus: 'Good',
                },
              ],
            },
          },
          {
            name: 'Pump 2',
            capacity: 60.0,
            horsepower: 180,
            location: 'Location B',
            checks: {
              create: [
                {
                  waterSealStatus: 'Leak',
                  pumpBearingStatus: 'Damaged',
                  motorBearingStatus: 'Normal',
                  rubberCouplingStatus: 'Good',
                  pumpImpellerStatus: 'Normal',
                  mainValvesStatus: 'Operational',
                  motorWindingStatus: 'Good',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Water management and pumps seeded:', waterManagement);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
