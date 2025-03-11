import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenants = [
    {
      tenantName: 'Saudi Pak',
      totalAreaSq: 25545,
      areas: [
        { floor: '17th', occupiedArea: 8500 },
        { floor: '18th', occupiedArea: 8500 },
        { floor: '19th', occupiedArea: 8555 },
      ],
    },
    {
      tenantName: 'Cafeteria',
      totalAreaSq: 0,
      areas: [{ floor: '3rd', occupiedArea: 0 }],
    },
    {
      tenantName: 'Huawei Tech.',
      totalAreaSq: 86640,
      areas: [
        { floor: '2nd', occupiedArea: 6150 },
        { floor: '3rd', occupiedArea: 6150 },
        { floor: '4th', occupiedArea: 6150 },
        { floor: '5th', occupiedArea: 6150 },
        { floor: '7th', occupiedArea: 6150 },
        { floor: '8th', occupiedArea: 6150 },
        { floor: '9th', occupiedArea: 6150 },
        { floor: '10th', occupiedArea: 6150 },
        { floor: '11th', occupiedArea: 6150 },
        { floor: '12th', occupiedArea: 6150 },
        { floor: '13th', occupiedArea: 6150 },
        { floor: '14th', occupiedArea: 6150 },
        { floor: '15th', occupiedArea: 6150 },
        { floor: '16th', occupiedArea: 6150 },
      ],
    },
    {
      tenantName: 'Vacant',
      totalAreaSq: 1523,
      areas: [{ floor: '4th', occupiedArea: 1523 }],
    },
    {
      tenantName: 'Taisei Corp.',
      totalAreaSq: 1523,
      areas: [{ floor: '5th', occupiedArea: 1523 }],
    },
    {
      tenantName: 'Sinohydro Corp.',
      totalAreaSq: 5454,
      areas: [{ floor: '5th', occupiedArea: 5454 }],
    },
    {
      tenantName: 'LCC Pakistan',
      totalAreaSq: 4092,
      areas: [{ floor: '9th', occupiedArea: 4092 }],
    },
    {
      tenantName: 'SAAB Intl.',
      totalAreaSq: 3419,
      areas: [{ floor: '9th', occupiedArea: 3419 }],
    },
    {
      tenantName: 'SPREL',
      totalAreaSq: 2243,
      areas: [{ floor: '10th', occupiedArea: 2243 }],
    },
    {
      tenantName: 'Capital Strategies',
      totalAreaSq: 1523,
      areas: [{ floor: '11th', occupiedArea: 1523 }],
    },
    {
      tenantName: 'Pak China Inv. Co.',
      totalAreaSq: 11406,
      areas: [
        { floor: '13th', occupiedArea: 9034 },
        { floor: '16th', occupiedArea: 2372 },
      ],
    },
    {
      tenantName: 'Alfalah Asset Mgt.',
      totalAreaSq: 2569,
      areas: [{ floor: '16th', occupiedArea: 2569 }],
    },
    {
      tenantName: 'Standard Chartered',
      totalAreaSq: 3500,
      areas: [{ floor: 'Ground – LRA', occupiedArea: 3500 }],
    },
    {
      tenantName: 'ICSI Pvt. Ltd.',
      totalAreaSq: 22981,
      areas: [
        { floor: 'Gr. + 1st (LRA)', occupiedArea: 11490 },
        { floor: '1st + 5th (HRA)', occupiedArea: 11491 },
      ],
    },
    {
      tenantName: 'Ericsson Pakistan',
      totalAreaSq: 13555,
      areas: [
        { floor: '2nd – LRA', occupiedArea: 6777 },
        { floor: '3rd – LRA', occupiedArea: 6778 },
      ],
    },
    {
      tenantName: 'Sumitomo Corp.',
      totalAreaSq: 2267,
      areas: [{ floor: '2nd – LRA', occupiedArea: 2267 }],
    },
    {
      tenantName: 'Professional Employers',
      totalAreaSq: 3088,
      areas: [{ floor: '2nd – LRA', occupiedArea: 3088 }],
    },
    {
      tenantName: 'EBC',
      totalAreaSq: 3161,
      areas: [{ floor: 'Ground – LRA', occupiedArea: 3161 }],
    },
    {
      tenantName: 'Vacant',
      totalAreaSq: 9459,
      areas: [
      { floor: '3rd', occupiedArea: 1947 },
      { floor: '10th', occupiedArea: 4942 },
      { floor: '16th', occupiedArea: 2570 }],
    }
  ];

  for (const tenant of tenants) {
    try {
      const createdTenant = await prisma.tenants.create({
        data: {
          tenantName: tenant.tenantName,
          totalAreaSq: tenant.totalAreaSq,
          area: {
            create: tenant.areas.map((area) => ({
              floor: area.floor,
              occupiedArea: area.occupiedArea,
            })),
          },
        },
      });

      console.log(`Created tenant: ${createdTenant.tenantName}`);
    } catch (error) {
      console.error(`Error creating tenant ${tenant.tenantName}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error('Error seeding tenants:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
