import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const formatDateTime = (dateTime) => {
    if (!dateTime) return null; // Return null for empty or invalid fields
    const parsedDate = new Date(dateTime);
    return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  };
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { date, supervisor, remarks, picture, attendance } = req.body;

      const newDutyChart = await prisma.dutyChart.create({
        data: {
          date:formatDateTime(date),
          supervisor,
          remarks,
          picture,
          attendance: {
            create: attendance.map((att) => ({
              name: att.name,
              designation: att.designation,
              timeIn: formatDateTime(att.timeIn),
              timeOut: formatDateTime(att.timeOut),
              lunchIn: formatDateTime(att.lunchIn),
              lunchOut: formatDateTime(att.lunchOut),
            })),
          },
        },
      });

      res.status(201).json(newDutyChart);
    } catch (error) {
      console.error("Error creating duty chart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'GET') {
    const {
      page = 1,
      dateFrom,
      dateTo,
      supervisor,
      remarks,
      attendanceCountMin,
      attendanceCountMax,
    } = req.query;
  
    const pageSize = 10; // Number of records per page
    const offset = (page - 1) * pageSize;
  
    const filters = {};
  
    if (dateFrom) {
      filters.date = { gte: new Date(dateFrom) };
    }
    if (dateTo) {
      filters.date = { ...filters.date, lte: new Date(dateTo) };
    }
    if (supervisor) {
      filters.supervisor = { equals: parseInt(supervisor) }; // Filter by supervisor ID
    }
    if (remarks) {
      filters.remarks = { contains: remarks, mode: 'insensitive' };
    }
    if (attendanceCountMin) {
      filters.attendanceCount = { gte: parseInt(attendanceCountMin) };
    }
    if (attendanceCountMax) {
      filters.attendanceCount = { lte: parseInt(attendanceCountMax) };
    }
  
    try {
      // Fetch duty charts with filters and pagination
      const dutyCharts = await prisma.dutyChart.findMany({
        where: filters,
        skip: offset,
        take: pageSize,
        include: {
          attendance: true, // Assuming the attendance is a related field
        },
      });
  
      // Fetch supervisor names for each supervisor ID in duty charts
      const supervisorIds = dutyCharts.map((chart) => chart.supervisor).filter(Boolean);
      const supervisors = await prisma.user.findMany({
        where: { id: { in: supervisorIds.map((e)=> parseInt(e)) } },
        select: { id: true, name: true }, // Fetch only ID and Name
      });
      console.log(supervisors)
      // Map supervisor names by ID for quick lookup
      const supervisorMap = supervisors.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});
  
      // Enhance duty chart data with supervisor names and attendance count
      const dataWithAttendance = dutyCharts.map((chart) => {
        const totalAttendance = chart.attendance.filter(
          (att) => att.timeIn && att.timeOut
        ).length;
  
        return {
          ...chart,
          supervisorName: supervisorMap[chart.supervisor] || 'N/A', // Add supervisor name
          attendanceCount: totalAttendance, // Add total attendance count
        };
      });
  
      // Get the total count of records for pagination
      const totalRecords = await prisma.dutyChart.count({
        where: filters,
      });
  
      const nextPage = page * pageSize < totalRecords;
  
      res.status(200).json({
        data: dataWithAttendance,
        nextPage,
      });
    } catch (error) {
      console.error('Error fetching duty chart data:', error);
      res.status(500).json({ error: 'Error fetching duty chart data' });
    }
  }
   else  {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
