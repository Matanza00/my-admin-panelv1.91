import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Get Janitorial Attendance ID from query

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch attendance record and related absences
      const attendance = await prisma.janitorialAttendance.findUnique({
        where: { id: parseInt(id) },
        include: {
          janitorAbsences: true,
        },
      });

      // Return 404 if attendance not found
      if (!attendance) {
        return res.status(404).json({ error: 'Attendance not found' });
      }

      // Fetch supervisor name if supervisor ID exists
      let supervisorName = 'Unknown Supervisor';
      if (attendance.supervisor) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(attendance.supervisor) },
          select: { name: true },
        });
        if (user) supervisorName = user.name;
      }

      // Return attendance with supervisor name
      return res.status(200).json({ ...attendance, supervisorName });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return res.status(500).json({ error: 'Error fetching janitorial attendance' });
    }
  } 
  
  else if (req.method === 'PUT') {
    const { supervisor, strength, absences } = req.body;
  
    try {
      // Log the ID and request body
      console.log('PUT Request ID:', id);
      console.log('PUT Request Body:', req.body);
  
      // Check if the attendance record exists
      const existingRecord = await prisma.janitorialAttendance.findUnique({
        where: { id: parseInt(id) },
      });
  
      console.log('Existing Record:', existingRecord);
  
      if (!existingRecord) {
        return res.status(404).json({ error: 'Attendance record not found' });
      }
  
      // Validate supervisor and get user ID
      const user = await prisma.user.findUnique({
        where: { id: parseInt(supervisor) },
        select: { id: true, name: true },
      });
      
  
      console.log('Supervisor Lookup:', user);
  
      if (!user) {
        return res.status(404).json({ error: 'Supervisor not found' });
      }
  
      // Update attendance record
      const updatedAttendance = await prisma.janitorialAttendance.update({
        where: { id: parseInt(id) },
        data: {
          supervisor: user.id.toString(), // Store supervisor ID as string
          strength: parseInt(strength),
          janitorAbsences: {
            deleteMany: {}, // Clear previous absences
            create: absences.map((absence) => ({
              name: absence.name,
              isAbsent: absence.isAbsent,
            })),
          },
        },
        include: {
          janitorAbsences: true,
        },
      });
  
      console.log('Updated Attendance:', updatedAttendance);
  
      // Return updated record with supervisor name
      return res.status(200).json({
        ...updatedAttendance,
        supervisorName: user.name,
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      return res.status(500).json({ error: 'Error updating janitorial attendance' });
    }
  }
   
  
  else {
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
