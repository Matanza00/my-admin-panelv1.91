import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { query, method } = req;
  const {
    page = 1, // Current page
    take = 10, // Items per page
    operatorName,
    supervisorName,
    remarks,
    startFrom,
    startTo,
    shutdownFrom,
    shutdownTo,
    sortBy = 'createdAt', // Default sort field
    sortOrder = 'desc', // Default sort order
  } = query;

  if (method === 'GET') {
    return handleGet(req, res, {
      page,
      take,
      operatorName,
      supervisorName,
      remarks,
      startFrom,
      startTo,
      shutdownFrom,
      shutdownTo,
      sortBy,
      sortOrder,
    });
  }

  if (method === 'POST') {
    return handlePost(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}

async function handleGet(req, res, filters) {
  const { page, take, operatorName, supervisorName, remarks, startFrom, startTo, shutdownFrom, shutdownTo, sortBy, sortOrder } = filters;

  try {
    const skip = (page - 1) * take;

    const where = {};
    if (operatorName) where.OperatorName = { contains: operatorName, mode: 'insensitive' };
    if (supervisorName) where.SupervisorName = { contains: supervisorName, mode: 'insensitive' };
    if (remarks) where.Remarks = { contains: remarks, mode: 'insensitive' };
    if (startFrom || startTo) {
      where.StartTime = {};
      if (startFrom) where.StartTime.gte = new Date(startFrom);
      if (startTo) where.StartTime.lte = new Date(startTo);
    }
    if (shutdownFrom || shutdownTo) {
      where.ShutdownTime = {};
      if (shutdownFrom) where.ShutdownTime.gte = new Date(shutdownFrom);
      if (shutdownTo) where.ShutdownTime.lte = new Date(shutdownTo);
    }

    const chillers = await prisma.AbsorbtionChiller.findMany({
      where,
      take: parseInt(take),
      skip: parseInt(skip),
      orderBy: { [sortBy]: sortOrder },
      include: { Chillers: true },
    });

    const operatorIds = [...new Set(chillers.map((c) => parseInt(c.OperatorName)).filter(Boolean))];
    const supervisorIds = [...new Set(chillers.map((c) => parseInt(c.SupervisorName)).filter(Boolean))];

    const operators = operatorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: operatorIds } },
          select: { id: true, name: true },
        })
      : [];

    const supervisors = supervisorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: supervisorIds } },
          select: { id: true, name: true },
        })
      : [];

    const operatorMap = Object.fromEntries(operators.map((o) => [o.id, o.name]));
    const supervisorMap = Object.fromEntries(supervisors.map((s) => [s.id, s.name]));

    const enrichedChillers = chillers.map((chiller) => ({
      ...chiller,
      OperatorName: operatorMap[chiller.OperatorName] || chiller.OperatorName || 'Unknown',
      SupervisorName: supervisorMap[chiller.SupervisorName] || chiller.SupervisorName || 'Unknown',
    }));

    const totalCount = await prisma.AbsorbtionChiller.count({ where });

    return res.status(200).json({
      data: enrichedChillers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / take),
        nextPage: page * take < totalCount,
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching chillers:', error);
    return res.status(500).json({ error: 'Error fetching chillers' });
  }
}

async function handlePost(req, res) {
  const { operatorName, supervisorName, startTime, shutdownTime, chillerData, remarks, createdById } = req.body;

  if (!operatorName || !supervisorName || !startTime || !shutdownTime || !createdById) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const startDate = new Date(startTime);
    const shutdownDate = new Date(shutdownTime);

    const formattedChillerData = chillerData?.map((data) => ({
      ColdWaterIn: parseFloat(data.ColdWaterIn) || 0,
      ColdWaterOut: parseFloat(data.ColdWaterOut) || 0,
      ChillingWaterIn: parseFloat(data.ChillingWaterIn) || 0,
      ChillingWaterOut: parseFloat(data.ChillingWaterOut) || 0,
      HeatIn: parseFloat(data.HeatIn) || 0,
      HeatOut: parseFloat(data.HeatOut) || 0,
      assistantSupervisor: data.assistantSupervisor || '',
    }));

    // Create the Absorption Chiller entry
    const chillerEntry = await prisma.AbsorbtionChiller.create({
      data: {
        OperatorName: operatorName,
        SupervisorName: supervisorName,
        Remarks: remarks || '',
        StartTime: startDate,
        ShutdownTime: shutdownDate,
        Chillers: {
          create: formattedChillerData,
        },
      },
    });

    // Fetch the name of the creator
    const creator = await prisma.user.findUnique({
      where: { id: parseInt(createdById, 10) },
      select: { name: true },
    });

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // Fetch target users for notifications (e.g., managers or supervisors)
    const targetUsers = await prisma.user.findMany({
      where: {
        role: {
          name: 'Manager', // Adjust this based on your roles
        },
      },
    });
      // Construct the report link
      const reportLink = `/daily-maintenance/absorptionchiller/view/${chillerEntry.id}`;
    // Create notifications for the target users
    const notificationPromises = targetUsers.map((user) =>
      prisma.notification.create({
        data: {
          templateId: 2, // Template ID for Absorption Chiller notifications
          userId: user.id,
          createdById: parseInt(createdById, 10),
          altText: `A new Absorption Chiller form has been created by ${creator.name}.`,
          link: reportLink, // Add the report link here
          isRead: false,
          sentAt: new Date(),
        },
      })
    );

    await Promise.all(notificationPromises);

    return res.status(201).json(chillerEntry);
  } catch (error) {
    console.error('Error creating or updating chiller:', error);
    return res.status(500).json({ error: 'Error creating or updating chiller' });
  }
}

