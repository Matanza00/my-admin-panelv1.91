export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const serverIP = "182.180.99.136";
  const serverPort = "8090";
  const username = "admin";
  const password = "ad123456";
  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    // 🔹 Step 1: Fetch all employees dynamically
    let allEmployees = [];
    let page = 1;

    while (true) {
      const employeesResponse = await fetch(
        `http://${serverIP}:${serverPort}/personnel/api/employees/?page=${page}&limit=50`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
        }
      );

      if (!employeesResponse.ok) {
        throw new Error(`Error fetching employees! Status: ${employeesResponse.status}`);
      }

      const employeesData = await employeesResponse.json();
      allEmployees = [...allEmployees, ...employeesData.data];

      if (!employeesData.next) break; // Stop if no more pages
      page++;
    }

    if (!allEmployees || allEmployees.length === 0) {
      return res.status(200).json({ message: "No employees found" });
    }

    console.log(`🔹 Fetching attendance for ${allEmployees.length} employees`);

    // 🔹 Step 2: Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // 🔹 Step 3: Fetch attendance for each employee and include first_name
    const fetchAttendanceForEmployee = async (employee) => {
      let allRecords = [];
      let page = 1;

      while (true) {
        const response = await fetch(
          `http://${serverIP}:${serverPort}/iclock/api/transactions/?emp_code=${employee.emp_code}&start_time=${today} 00:01:00&end_time=${today} 23:59:00&page=${page}&limit=50`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${basicAuth}`,
            },
          }
        );

        if (!response.ok) {
          console.error(`❌ Failed to fetch attendance for emp_code: ${employee.emp_code}`);
          return { emp_code: employee.emp_code, department: employee.department, first_name: employee.first_name, attendance: [], error: "Error fetching attendance" };
        }

        const data = await response.json();
        allRecords = [...allRecords, ...data.data];

        if (!data.next) break; // No more pages to fetch
        page++;
      }

      return {
        emp_code: employee.emp_code,
        first_name: employee.first_name, // 🔹 Include first_name
        attendance: allRecords,
        department: employee.department,
      };
    };

    // 🔹 Step 4: Run all API calls in parallel using `Promise.all()`
    const attendancePromises = allEmployees.map((employee) => fetchAttendanceForEmployee(employee));
    const attendanceResults = await Promise.all(attendancePromises);

    console.log(`✅ Attendance fetched for ${attendanceResults.length} employees`);

    // 🔹 Step 5: Return results
    return res.status(200).json({
      totalEmployees: allEmployees.length,
      attendanceRecords: attendanceResults,
    });

  } catch (error) {
    console.error("❌ Error fetching attendance data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
