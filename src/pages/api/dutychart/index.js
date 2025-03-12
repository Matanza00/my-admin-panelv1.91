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
        const { date, supervisor, remarks, picture, attendance = [] } = req.body;

        const newDutyChart = await prisma.dutyChart.create({
            data: {
                date: formatDateTime(date),
                supervisor,
                remarks,
                picture,
                attendance: {
                  create: (attendance || [])
                      .filter(att => att.name && att.designation && att.timeIn) // Ensuring required fields exist
                      .map(att => ({
                          name: att.name,
                          designation: att.designation,
                          timeIn: formatDateTime(att.timeIn), // Required
                          timeOut: att.timeOut ? formatDateTime(att.timeOut) : null,
                          lunchIn: att.lunchIn ? formatDateTime(att.lunchIn) : null,
                          lunchOut: att.lunchOut ? formatDateTime(att.lunchOut) : null,
                      })),
              }       ,                      
            },
        });

        res.status(201).json(newDutyChart);
    } catch (error) {
        console.error("Error creating duty chart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'GET') {
    try {
        console.log("📌 Received GET request:", req.query); // Debug incoming query parameters

        const {
            page = 1,
            limit = 10,
            dateFrom,
            dateTo,
            supervisor,
            remarks,
            attendanceCountMin,
            attendanceCountMax,
        } = req.query;

        const pageSize = parseInt(limit) || 10;
        const offset = (parseInt(page) - 1) * pageSize;

        // Initialize filters with soft-delete exclusion
        const filters = { deletedAt: null };

        if (dateFrom) filters.date = { gte: new Date(dateFrom) };
        if (dateTo) filters.date = { ...filters.date, lte: new Date(dateTo) };
        if (supervisor) {
            const supervisorId = parseInt(supervisor);
            if (!isNaN(supervisorId)) filters.supervisor = { equals: supervisorId };
        }
        if (remarks) filters.remarks = { contains: remarks, mode: 'insensitive' };

        console.log("🔍 Applying Filters:", filters); // Debugging applied filters

        // Fetch duty charts with filters and pagination
        const dutyCharts = (await prisma.dutyChart.findMany({
            where: filters,
            skip: offset,
            take: pageSize,
            include: {
                attendance: true, // Ensure attendance is always included
            },
        })) || [];

        console.log("✅ Fetched Duty Charts:", JSON.stringify(dutyCharts, null, 2)); // Debugging fetched data

        // Fetch supervisor names only if there are supervisors
        const supervisorIds = dutyCharts
        .map((chart) => parseInt(chart.supervisor)) // Convert to number
        .filter((id) => !isNaN(id)); // Only keep valid numbers

          console.log("✅ Valid Supervisor IDs for Prisma Query:", supervisorIds);

          let supervisorMap = {};

          // Fetch only if we have valid numeric supervisor IDs
          if (supervisorIds.length > 0) {
              try {
                  const supervisors = await prisma.user.findMany({
                      where: { id: { in: supervisorIds } }, // Pass only numeric IDs
                      select: { id: true, name: true }, // Fetch only ID and Name
                  });

                  console.log("✅ Fetched Supervisors from DB:", JSON.stringify(supervisors, null, 2));

                  supervisorMap = supervisors.reduce((acc, user) => {
                      acc[user.id] = user.name;
                      return acc;
                  }, {});
              } catch (err) {
                  console.error("❌ Error fetching supervisors:", err);
              }
          }


        // Apply attendance count filtering manually
        const dataWithAttendance = dutyCharts.map((chart) => {
            console.log("📌 Processing chart:", chart.id); // Logging each duty chart ID

            const totalAttendance = (chart.attendance || []).filter(
                (att) => att.timeIn && att.timeOut
            ).length;

            console.log("✅ Attendance Count for Chart:", chart.id, totalAttendance);

            return {
                ...chart,
                supervisorName: chart.supervisor ? (supervisorMap[chart.supervisor] || 'N/A') : 'N/A',
                attendanceCount: totalAttendance,
            };
        });

        console.log("📌 Data With Attendance Count:", JSON.stringify(dataWithAttendance, null, 2));

        // Apply attendance count filters manually after data retrieval
        const filteredData = dataWithAttendance.filter((chart) => {
            if (attendanceCountMin && chart.attendanceCount < parseInt(attendanceCountMin)) return false;
            if (attendanceCountMax && chart.attendanceCount > parseInt(attendanceCountMax)) return false;
            return true;
        });

        console.log("✅ Filtered Data:", JSON.stringify(filteredData, null, 2));

        // Get the total count of records for pagination
        const totalRecords = await prisma.dutyChart.count({ where: filters });

        console.log("📌 Total Records in DB:", totalRecords);

        const nextPage = (parseInt(page) * pageSize) < totalRecords;

        const responsePayload = {
            data: filteredData.length > 0 ? filteredData : [], // Ensure response data is never null
            nextPage,
        };

        console.log("🚀 Final API Response:", JSON.stringify(responsePayload, null, 2));

        res.status(200).json(responsePayload);

    } catch (error) {
        console.error('❌ Error fetching duty chart data:', error);
        res.status(500).json({ error: 'Error fetching duty chart data' });
    }
}

   else  {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
