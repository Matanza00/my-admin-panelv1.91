import prisma from "../../../lib/prisma"; // Assuming Prisma client is located here

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { from, to, status } = req.query;

        // Validate 'from' and 'to' query params
        if (!from || !to) {
          return res.status(400).json({ error: "'from' and 'to' query parameters are required." });
        }

        // Convert 'from' and 'to' to Date objects
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format provided." });
        }

        console.log(`Filtering from ${fromDate} to ${toDate} with status: ${status || "all"}`); // Log the filters for debugging

        // Build the where clause dynamically based on the presence of 'status'
        const whereClause = {
          date: {
            gte: fromDate,
            lte: toDate,
          },
        };

        if (status) {
          whereClause.status = status;
        }

        // Fetch FeedbackComplain records within the date range and status
        const feedbackComplaints = await prisma.feedbackComplain.findMany({
          where: whereClause,
          orderBy: {
            date: 'asc', // Order by date to ensure correct ordering
          },
        });

        console.log(`Found ${feedbackComplaints.length} feedback complaints`); // Log how many complaints were found

        // If no data is found
        if (!feedbackComplaints || feedbackComplaints.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // Map the complaints and their job slips
        const updatedFeedbackComplaints = feedbackComplaints.map((complaint) => ({
          ...complaint,
          tenant: complaint.tenant
            ? {
                id: complaint.tenant.id,
                name: complaint.tenant.name, // Assuming tenant has name field
              }
            : null,
        }));

        // Return the updated data
        return res.status(200).json(updatedFeedbackComplaints);
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
