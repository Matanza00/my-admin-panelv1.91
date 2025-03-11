import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // Permissions
  const permissions = [
    'manageUsers',
    'manageTenants',
    'manageJobSlip',
    'manageJanitorialAttendance',
    'manageJanitorialReports',
    'manageDutyChart',
    'manageOccupancy',
  ];

  console.log('Seeding permissions...');
  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Roles
  const roles = ['super_admin', 'admin', 'supervisor', 'technician'];
  const roleRecords = {};

  console.log('Seeding roles...');
  for (const name of roles) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roleRecords[name] = role;
  }

  // Departments
  const departments = [
    { name: 'Administration', code: 'ADM' },
    { name: 'Management', code: 'MNG' },
    { name: 'Operations', code: 'OPS' },
    { name: 'Technical', code: 'TEC' },
  ];
  const departmentRecords = {};

  console.log('Seeding departments...');
  for (const department of departments) {
    const dept = await prisma.department.upsert({
      where: { name: department.name },
      update: { code: department.code },
      create: department,
    });
    departmentRecords[department.name] = dept;
  }

  // Role-Department-Permission Assignments
  const allPermissions = await prisma.permission.findMany();

  console.log('Assigning permissions to roles for departments...');
  for (const department of Object.values(departmentRecords)) {
    for (const role of Object.values(roleRecords)) {
      for (const permission of allPermissions) {
        await prisma.roleDepartmentPermission.upsert({
          where: {
            roleId_permissionId_departmentId: {
              roleId: role.id,
              permissionId: permission.id,
              departmentId: department.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
            departmentId: department.id,
          },
        });
      }
    }
  }

  // Users
  const users = [
    {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: 'superadmin123',
      roleName: 'super_admin',
      departmentName: 'Administration',
    },
    {
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      roleName: 'admin',
      departmentName: 'Management',
    },
    {
      name: 'Supervisor User',
      username: 'supervisor',
      email: 'supervisor@example.com',
      password: 'supervisor123',
      roleName: 'supervisor',
      departmentName: 'Operations',
    },
    {
      name: 'Technician User',
      username: 'technician',
      email: 'technician@example.com',
      password: 'technician123',
      roleName: 'technician',
      departmentName: 'Technical',
    },
  ];

  console.log('Seeding users...');
  for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        username: user.username,
        password: hashedPassword,
        roleId: roleRecords[user.roleName].id,
        departmentId: departmentRecords[user.departmentName].id,
      },
      create: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        roleId: roleRecords[user.roleName].id,
        departmentId: departmentRecords[user.departmentName].id,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
