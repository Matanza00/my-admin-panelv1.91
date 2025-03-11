import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    // Pagination logic for GET request
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      // Fetch paginated data from Prisma for DutyChart
      const dutyChartData = await prisma.dutyChart.findMany({
        skip: offset,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          attendance: true,  // Including attendance records
        },
      });

      // Convert date fields to JSON-safe strings
      const serializedData = dutyChartData.map(item => ({
        ...item,
        date: item.date.toISOString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        attendance: item.attendance.map(attendant => ({
          ...attendant,
          timeIn: attendant.timeIn.toISOString(),
          timeOut: attendant.timeOut.toISOString(),
          lunchIn: attendant.lunchIn?.toISOString(),
          lunchOut: attendant.lunchOut?.toISOString(),
        })),
      }));

      // Check if there's more data for pagination
      const nextPage = serializedData.length === limit;

      res.status(200).json({ data: serializedData, nextPage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }

  } else if (method === 'PUT') {
    // Logic for updating a specific duty chart entry
    const { id } = req.query;

    const {
      date,
      supervisor,
      attendance,
      remarks,
      picture,
    } = req.body;

    try {
      // Update the duty chart record in the database
      const updatedDutyChart = await prisma.dutyChart.update({
        where: {
          id: parseInt(id), // Parse the id from query params
        },
        data: {
          date: new Date(date),
          supervisor,
          attendance: {
            deleteMany: {}, // Deletes existing attendance, can be updated instead
            create: attendance, // Assuming the structure is correct to insert attendance
          },
          remarks,
          picture,
        },
      });

      // Send the updated data as a response
      return res.status(200).json(updatedDutyChart);
    } catch (error) {
      console.error('Error updating the duty chart:', error);
      return res.status(500).json({ error: 'Failed to update the duty chart.' });
    }

  } else if (method === 'POST') {
    // Check if req.body is null or undefined, indicating no data sent
    const {
      date,
      supervisor,
      attendance,
      remarks,
      picture,
    } = req.body || {
      // Default demo data
      date: new Date("2024-11-03T08:00:00Z"),
      supervisor: "John Doe",
      attendance: [
        {
          name: "Alice",
          designation: "Cleaner",
          timeIn: new Date("2024-11-03T08:00:00Z"),
          timeOut: new Date("2024-11-03T17:00:00Z"),
          lunchIn: new Date("2024-11-03T12:00:00Z"),
          lunchOut: new Date("2024-11-03T13:00:00Z"),
        },
        {
          name: "Bob",
          designation: "Security",
          timeIn: new Date("2024-11-03T09:00:00Z"),
          timeOut: new Date("2024-11-03T18:00:00Z"),
          lunchIn: new Date("2024-11-03T13:00:00Z"),
          lunchOut: new Date("2024-11-03T14:00:00Z"),
        },
      ],
      remarks: "All duties completed",
      picture: "https://via.placeholder.com/150",
    };

    try {
      // Create a new duty chart record in the database
      const newDutyChart = await prisma.dutyChart.create({
        data: {
          date,
          supervisor,
          attendance: {
            create: attendance, // Create new attendance records
          },
          remarks,
          picture,
        },
      });

      // Send the newly created record as a response
      return res.status(201).json(newDutyChart);
    } catch (error) {
      console.error('Error creating the duty chart:', error);
      return res.status(500).json({ error: 'Failed to create the duty chart.' });
    }

  } else if (method === 'DELETE') {
    // Logic for deleting a specific duty chart entry
    const { id } = req.query;

    try {
      // Delete the record from the database
      const deletedDutyChart = await prisma.dutyChart.delete({
        where: {
          id: parseInt(id), // Parse the id from query params
        },
      });

      // Send the deleted record as a response
      return res.status(200).json(deletedDutyChart);
    } catch (error) {
      console.error('Error deleting the duty chart:', error);
      return res.status(500).json({ error: 'Failed to delete the duty chart.' });
    }

  } else {
    // Handle unsupported methods
    res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
