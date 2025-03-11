// pages/api/firefightingduty/[id].js

import prisma from '../../../lib/prisma'; // Assuming you have Prisma client set up in this file

export default async function handler(req, res) {
  const { id } = req.query; // Get the `id` from the dynamic route

  // Handle GET request
  if (req.method === 'GET') {
    // Ensure `id` is a valid number
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing ID' });
    }

    try {
      // Fetch firefighting duty details by ID
      const duty = await prisma.firefightingDuty.findUnique({
        where: { id: parseInt(id, 10) }, // Ensure the ID is parsed to an integer
        include: {
          users: {
            select: {
              id: true,
              name: true,
              role: true,
              department: true,
            }
          },
        },
      });

      // Handle case where no firefighting duty is found
      if (!duty) {
        return res.status(404).json({ error: 'Duty not found' });
      }

      // Respond with the firefighting duty and associated users
      res.status(200).json(duty);
    } catch (error) {
      console.error('Error fetching firefighting duty:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query; // Get the firefighting duty ID from the query params
    const { date, shift, users } = req.body; // Get the updated data from the request body

    try {
      // Update the FirefightingDuty with new date, shift, and associated users
      const updatedDuty = await prisma.firefightingDuty.update({
        where: { id: parseInt(id) }, // Find the duty by ID
        data: {
          date: new Date(date), // Set the new date
          shift, // Set the new shift
          users: {
            set: users.map(user => ({ id: user.id })) // Link the users by their IDs
          }
        }
      });

      // Respond with the updated duty
      return res.status(200).json(updatedDuty);
    } catch (error) {
      console.error('Error updating firefighting duty:', error);
      return res.status(500).json({ message: 'Error updating firefighting duty' });
    }
  } else {
    // If the method is not GET, return a 405 Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
