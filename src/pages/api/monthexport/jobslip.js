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

        console.log(`Filtering job slips from ${fromDate} to ${toDate} with status: ${status || "all"}`);

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

        // Fetch JobSlip records within the date range and status
        const jobSlips = await prisma.jobSlip.findMany({
          where: whereClause,
          orderBy: {
            date: "asc",
          },
        });

        console.log(`Found ${jobSlips.length} job slips`);

        // If no data is found
        if (!jobSlips || jobSlips.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        // ✅ Fetch Attended By Names & Department Names Safely
        const updatedJobSlips = await Promise.all(
          jobSlips.map(async (jobSlip) => {
            let attendedByName = "N/A";
            let departmentName = "N/A";

            try {
              // Ensure jobSlip.attendedBy is valid before querying
              if (jobSlip.attendedBy && !isNaN(jobSlip.attendedBy)) {
                const attendedUser = await prisma.user.findUnique({
                  where: { id: Number(jobSlip.attendedBy) },
                  select: { name: true },
                });
                attendedByName = attendedUser?.name ?? "N/A"; // Fallback if null
              }
            } catch (error) {
              console.error(`Error fetching attendedBy (${jobSlip.attendedBy}):`, error);
            }

            try {
              // Ensure jobSlip.department is valid before querying
              if (jobSlip.department && !isNaN(jobSlip.department)) {
                const department = await prisma.department.findUnique({
                  where: { id: Number(jobSlip.department) },
                  select: { name: true },
                });
                departmentName = department?.name ?? "N/A"; // Fallback if null
              }
            } catch (error) {
              console.error(`Error fetching department (${jobSlip.department}):`, error);
            }

            return {
              ...jobSlip,
              attendedBy: attendedByName, // Replace ID with Name
              department: departmentName, // Replace ID with Name
              feedbackComplain: jobSlip.feedbackComplain
                ? {
                    complainNo: jobSlip.feedbackComplain.complainNo,
                    complainBy: jobSlip.feedbackComplain.complainBy,
                    complaintDesc: jobSlip.feedbackComplain.complaintDesc,
                  }
                : null, // Only include feedback complain details if they exist
            };
          })
        );

        // Return the updated data
        return res.status(200).json(updatedJobSlips);
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
