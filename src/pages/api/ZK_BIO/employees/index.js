export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const username = "admin";
    const password = "ad123456";
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
  
    let page = 1;
    let allEmployees = [];
  
    try {
      while (true) {
        const response = await fetch(`http://182.180.99.136:8090/personnel/api/employees/?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`
          }
        });
  
        if (!response.ok) {
          throw new Error(`API error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        allEmployees = [...allEmployees, ...data.data];
  
        if (!data.next) break; // Stop if no more pages
        page++;
      }
  
      // 🔍 Find employees where `enable_attendance` is `false`
      const employeesWithAttendanceFalse = allEmployees.filter(emp => emp.attemployee && emp.attemployee.enable_attendance === false);
  
      return res.status(200).json({
        totalEmployees: allEmployees.length,
        allEmployees,
        employeesWithAttendanceFalse,
        countWithAttendanceFalse: employeesWithAttendanceFalse.length
      });
  
    } catch (error) {
      console.error("Error fetching employees:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  