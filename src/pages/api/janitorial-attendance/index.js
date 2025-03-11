import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch janitorial attendance data with supervisor names
    const { page = 1, supervisor, strengthMin, strengthMax, dateFrom, dateTo } = req.query;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const where = {};
    if (supervisor) where.supervisor = parseInt(supervisor);
    if (strengthMin) where.strength = { gte: parseInt(strengthMin) };
    if (strengthMax) where.strength = { lte: parseInt(strengthMax) };
    if (dateFrom || dateTo) where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);

    try {
      const records = await prisma.janitorialAttendance.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' },
      });

      // Replace supervisor ID with supervisor name
      const updatedRecords = await Promise.all(
        records.map(async (record) => {
          let supervisorName = 'Unknown Supervisor';
      if (record.supervisor) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(record.supervisor) },
          select: { name: true },
        });
        if (user) supervisorName = user.name;
      }
          return { ...record, supervisorName };
        })
      );
      
      // Fetch total count to calculate remaining pages
  const totalCount = await prisma.janitorialAttendance.count({ where });

  // Determine if there is a next page
  const hasMore = skip + records.length < totalCount;

  console.log('Updated Records with Supervisor Names:', updatedRecords);
res.status(200).json({ data: updatedRecords, nextPage: hasMore });


      res.status(200).json({ data: updatedRecords, nextPage: records.length === pageSize });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching janitorial attendance', details: error.message });
    }
  } 
   else if (req.method === 'POST') {
    const { supervisor, strength, absences, date, remarks } = req.body;
  
    console.log('Received body:', req.body);
  
    // Validate required fields
    if (!supervisor || !strength || !absences) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      // Fetch supervisor by name using findFirst
      const user = await prisma.user.findFirst({
        where: { name: supervisor },
        select: { id: true, name: true },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Supervisor not found' });
      }
  
      // Create new Janitorial Attendance record
      const newAttendance = await prisma.janitorialAttendance.create({
        data: {
          supervisor: user.id.toString(), // Store supervisor ID as a string
          strength: parseInt(strength),
          totalJanitors: absences.length,
          date: date ? new Date(date) : new Date(),
          remarks,
          janitorAbsences: {
            create: absences.map((absence) => ({
              name: absence.name,
              isAbsent: absence.isAbsent,
            })),
          },
        },
        include: {
          janitorAbsences: true, // Return absences along with the attendance data
        },
      });
  
      res.status(201).json({ ...newAttendance, supervisorName: user.name });
    } catch (error) {
      console.error('Error creating janitorial attendance:', error);
      res.status(500).json({ error: 'Error creating janitorial attendance', message: error.message });
    }
  }  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
