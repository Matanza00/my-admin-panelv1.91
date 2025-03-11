import { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUserTimes, FaClock, FaUserCheck } from "react-icons/fa";

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const [lateEmployees, setLateEmployees] = useState([]);
  const [openAbsentModal, setOpenAbsentModal] = useState(false);
  const [openLateModal, setOpenLateModal] = useState(false);
  const userRole = "superadmin"; // Replace with dynamic user role

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("/api/ZK_BIO/attendance");
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><CircularProgress /></div>;
  }

  if (!attendanceData || (userRole !== "superadmin" && userRole !== "admin")) {
    return <div className="text-center text-red-500">Access Denied</div>;
  }

  const totalEmployees = attendanceData.totalEmployees || 0;
  const employeesPresent = attendanceData.attendanceRecords.filter(emp => emp.attendance.length > 0).length;
  const employeesAbsent = totalEmployees - employeesPresent;
  
  const lateArrivals = attendanceData.attendanceRecords.filter(emp => 
    emp.attendance.some(punch => punch.punch_state === "0" && new Date(punch.punch_time).getHours() > 9)
  ).length;

  const earlyLeavings = attendanceData.attendanceRecords.filter(emp => 
    emp.attendance.some(punch => punch.punch_state === "1" && new Date(punch.punch_time).getHours() < 17)
  ).length;

  const handleAbsentClick = () => {
    const absentList = attendanceData.attendanceRecords
      .filter(emp => emp.attendance.length === 0)
      .map(emp => ({
        emp_code: emp.emp_code,
        first_name: emp.first_name || "Unknown",
        department: emp.department?.dept_name || "N/A",
        last_check_in: "No Check-in",
      }));
    setAbsentEmployees(absentList);
    setOpenAbsentModal(true);
  };

  const handleLateClick = () => {
    const lateList = attendanceData.attendanceRecords
      .map(emp => ({
        emp_code: emp.emp_code,
        first_name: emp.first_name || "Unknown",
        punch_time: emp.attendance.length > 0 ? emp.attendance[0].punch_time : "N/A",
        status: emp.attendance.some(punch => punch.punch_state === "0" && new Date(punch.punch_time).getHours() > 9)
          ? "Late Arrival"
          : emp.attendance.some(punch => punch.punch_state === "1" && new Date(punch.punch_time).getHours() < 17)
          ? "Early Exit"
          : "N/A"
      }))
      .filter(emp => emp.status !== "N/A");

    setLateEmployees(lateList);
    setOpenLateModal(true);
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-lg hover:shadow-2xl transition">
          <CardContent>
            <Typography variant="h6">Registered Employees</Typography>
            <Typography variant="h4">{totalEmployees}</Typography>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition">
          <CardContent>
            <Typography variant="h6">Present Today</Typography>
            <Typography variant="h4" color="primary">{employeesPresent}</Typography>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition cursor-pointer" onClick={handleAbsentClick}>
          <CardContent>
            <Typography variant="h6">Absent Today <FaUserTimes className="inline-block text-red-500 ml-2" /></Typography>
            <Typography variant="h4" color="error">{employeesAbsent}</Typography>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition cursor-pointer" onClick={handleLateClick}>
          <CardContent>
            <Typography variant="h6">Late Arrivals / Early Exits <FaClock className="inline-block text-orange-500 ml-2" /></Typography>
            <Typography variant="h4" color="warning">{lateArrivals + earlyLeavings}</Typography>
          </CardContent>
        </Card>
      </div>

      

      {/* Modern Modal for Absent Employees */}
      <Dialog open={openAbsentModal} onClose={() => setOpenAbsentModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gray-900 text-white">Absent Employees</DialogTitle>
        <DialogContent className="p-4">
          {absentEmployees.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {absentEmployees.map((emp) => (
                <div key={emp.emp_code} className="flex justify-between border-b p-2">
                  <span className="text-lg font-medium">{emp.first_name} ({emp.emp_code})</span>
                  <span className="text-gray-500">{emp.department}</span>
                </div>
              ))}
            </div>
          ) : (
            <Typography>No absent employees found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAbsentModal(false)} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modern Modal for Late Arrivals / Early Exits */}
      <Dialog open={openLateModal} onClose={() => setOpenLateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gray-900 text-white">Late Arrivals & Early Exits</DialogTitle>
        <DialogContent className="p-4">
          {lateEmployees.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {lateEmployees.map((emp) => (
                <div key={emp.emp_code} className="flex justify-between border-b p-2">
                  <span className="text-lg font-medium">{emp.first_name} ({emp.emp_code})</span>
                  <span className="text-gray-500">{emp.status} - {emp.punch_time}</span>
                </div>
              ))}
            </div>
          ) : (
            <Typography>No late arrivals or early exits found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLateModal(false)} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AttendanceDashboard;
