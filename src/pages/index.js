'use client';
import Layout from '../components/layout';
import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaUsers, FaCogs, FaClipboardList, FaExclamationCircle, FaClipboardCheck } from 'react-icons/fa';
import { MdSecurity, MdCleanHands, MdCameraAlt } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import AttendanceDashboard from '../components/attendanceDashboard';



const AuthComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);  
/*ZK BIO Employee Fetch */
  // const fetchEmployees = async () => {
  //   try {
  //     const response = await fetch("/api/ZK_BIO/employees"); // Calls Next.js API route
  //     const data = await response.json();
  
  //     // console.log("Total Employees:", data.totalEmployees);
  //     // console.log("All Employees:", data.allEmployees);
  //     // console.log("Employees with enable_attendance: false", data.countWithAttendanceFalse);
  //     // console.log("List of employees with enable_attendance: false", data.employeesWithAttendanceFalse);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //   }
  // };
  
  // // Call function
  // fetchEmployees();
  // /*ZK BIO Employee Attendance Fetch */
  
  // const fetchAttendanceForAllEmployees = async () => {
  //   try {
  //     const response = await fetch("/api/ZK_BIO/attendance"); // Call Next.js API route
  //     const data = await response.json();
  
  //     // console.log("Total Employees:", data.totalEmployees);
  //     // console.log("Attendance Records:", data.attendanceRecords);
  //   } catch (error) {
  //     console.error("Error fetching attendance data:", error);
  //   }
  // };
  
  // // Call function
  // fetchAttendanceForAllEmployees();
  
  
  
  
  
  


  const authenticateAndFetchData = async () => {
    const url = 'http://182.180.99.136:8090/api/docs/#api-token-auth';
    const payload = JSON.stringify({
      username: 'admin',
      password: 'ad123456',
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };
console.log("auth",data)
  return (
    <div></div>
  );
};


const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    tenants: 0,
    supervisors: 0,
    technicians: 0,
    complaints: 0,
    jobSlips: 0,
    janitorialReports: 0,
    securityReports: 0,
    cctvReports: 0,
  });
  const [jobSlipDataState, setJobSlipDataState] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]); // Add feedbackData state
  const [feedbackStatus, setFeedbackStatus] = useState({
    Open: 0,
    Pending: 0,
    'In Progress': 0,
    Completed: 0,
  });
  const [jobSlipStatus, setJobSlipStatus] = useState({
    Open: 0,
    Pending: 0,
    'In Progress': 0,
    Completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  // const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  // const chartRef = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role?.toLowerCase();

  
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (role === 'technician') {
        setLoading(false);
        return; // Skip fetching dashboard data for technicians
      }
      try {
         
         // Fetch the session to get the access token
      const authRes = await fetch('/api/auth/session');
      const authData = await authRes.json();

      const token = authData?.user?.accessToken;
      console.log('Access Token:', token);

        const tenantsRes = await fetch('/api/tenants');
        const tenantsData = await tenantsRes.json();

        const supervisorsRes = await fetch('/api/users/filtered?roles=supervisor');
        const supervisorsData = await supervisorsRes.json();

        const techniciansRes = await fetch('/api/users/filtered?roles=technician');
        const techniciansData = await techniciansRes.json();

         // Fetch all data
         const complaintsRes = await fetch('/api/feedbackcomplain', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const complaintsData = await complaintsRes.json();
        console.log("Fetched Feedback Complaints:", complaintsData);
        setFeedbackData(Array.isArray(complaintsData) ? complaintsData : []);





        const jobSlipsRes = await fetch('/api/job-slip', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobSlipsData = await jobSlipsRes.json();
        setJobSlipDataState(jobSlipsData.data || []);

        const janitorialReportsRes = await fetch('/api/janitorial-report');
        const janitorialReportsData = await janitorialReportsRes.json();

        const securityReportsRes = await fetch('/api/security-reports');
        const securityReportsData = await securityReportsRes.json();

        const cctvReportsRes = await fetch('/api/cctv-report');
        const cctvReportsData = await cctvReportsRes.json();

        // Process complaint statuses
        // Initialize status counts
        const complaintsStatusCounts = { Open: 0, Pending: 0, 'In Progress': 0, Resolved: 0 };

          if (Array.isArray(complaintsData)) {
            complaintsData.forEach((complaint) => {
              const status = complaint.status?.trim(); // Trim spaces to normalize status values
              if (complaintsStatusCounts[status] !== undefined) {
                complaintsStatusCounts[status] += 1;
              } else {
                console.warn(`Unexpected status: ${status}`);
              }
            });
          }

        

        console.log('Complaints Status Counts:', complaintsStatusCounts);

        // Process job slip statuses
          const jobSlipsStatusCounts = { Open: 0, Pending: 0, 'In Progress': 0, Completed: 0 }; // Initialize counts

          if (Array.isArray(jobSlipsData.data)) {
            jobSlipsData.data.forEach((jobSlip) => {
              const status = jobSlip.status.trim(); // Normalize status (e.g., trim spaces)
              if (jobSlipsStatusCounts[status] !== undefined) {
                jobSlipsStatusCounts[status] += 1;
              } else {
                console.warn(`Unexpected status in job slips: ${status}`); // Log unexpected statuses
              }
            });
          }

          console.log('Job Slips Status Counts:', jobSlipsStatusCounts);
          setJobSlipStatus(jobSlipsStatusCounts);


        setDashboardData({
          tenants: tenantsData?.data?.length || tenantsData?.total || 0,
          supervisors: supervisorsData?.length || 0,
          technicians: techniciansData?.length || techniciansData.total || 0,
          complaints: Array.isArray(complaintsData) ? complaintsData.length : 0,
          jobSlips: jobSlipsData?.data?.length || jobSlipsData?.total || 0,
          janitorialReports: janitorialReportsData?.data?.length || janitorialReportsData?.total || 0,
          securityReports: securityReportsData?.length || securityReportsData.total || 0,
          cctvReports: cctvReportsData?.data?.length || cctvReportsData?.total || 0,
        });

        setFeedbackStatus(complaintsStatusCounts);
        setJobSlipStatus(jobSlipsStatusCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchFeedbackComplaints = async () => {
    try {
      const complaintsRes = await fetch('/api/feedbackcomplain', {
        headers: {},
      });
  
      if (!complaintsRes.ok) {
        throw new Error(`Error: ${complaintsRes.status} - ${complaintsRes.statusText}`);
      }
  
      const complaintsData = await complaintsRes.json();
      console.log("Fetched Feedback Complaints:", complaintsData);
  
      setFeedbackData(Array.isArray(complaintsData) ? complaintsData : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };
  
  // Call function inside useEffect or on component mount
  useEffect(() => {
    fetchFeedbackComplaints();
  }, []);
  
  

  const barData = {
    labels: ['Complaints', 'Job Slips', 'Janitorial Reports'],
    datasets: [
      {
        label: 'Count',
        data: [
          dashboardData.complaints,
          dashboardData.jobSlips,
          dashboardData.janitorialReports,

        ],
        backgroundColor: ['#4C51BF', '#48BB78', '#ED8936', ],
      },
    ],
  };
  const barData2 = {
    labels: ['Security Reports', 'CCTV Reports'], // Correct labels
    datasets: [
      {
        label: 'Count',
        data: [
          dashboardData.securityReports, // Security Reports count
          dashboardData.cctvReports,    // CCTV Reports count
        ],
        backgroundColor: ['#F56565', '#63B3ED'], // Colors for each bar
      },
    ],
  };
  

  const handlePieClick = (event, elements, chartData, dataState) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = chartData.labels[clickedIndex];
  
      // Filter data based on the label
      const filteredData = dataState.filter(
        (item) => item.status?.trim() === clickedLabel
      );
  
      if (filteredData.length > 0) {
        setPopupData(filteredData);
        setPopupVisible(true);
      }
    }
  };
  

  const pieData = {
    labels: ['Open', 'Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Feedback Complaints',
        data: [
          feedbackStatus['Open'],
          feedbackStatus['Pending'],
          feedbackStatus['In Progress'],
          feedbackStatus['Resolved'],
        ],
        backgroundColor: ['#F56565', '#63B3ED', '#48BB78', '#9F7AEA'],
      },
    ],
  };

  const jobSlipPieData = {
    labels: ['Open', 'Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Job Slips',
        data: [
          jobSlipStatus['Open'],
          jobSlipStatus['Pending'],
          jobSlipStatus['In Progress'],
          jobSlipStatus['Completed'],
        ],
        backgroundColor: ['#F6AD55', '#ED8936', '#9F7AEA', '#68D391'],
      },
    ],
  };
  

  // const jobSlipData = {
  //   labels: ['Open', 'Pending', 'InProgress', 'Completed'],
  //   datasets: [
  //     {
  //       label: 'Job Slips',
  //       data: [
  //         jobSlipStatus['Open'],
  //         jobSlipStatus['Pending'],
  //         jobSlipStatus['InProgress'],
  //         jobSlipStatus.Completed,
  //       ],
  //       backgroundColor: ['#F6AD55', '#ED8936', '#9F7AEA', '#68D391'],
  //       hoverOffset: 4,
  //     },
  //   ],
  // };
  const cardData = [
    { label: "Total Tenants", value: dashboardData.tenants, icon: <FaUsers />, color: "from-blue-500 to-blue-700" },
    { label: "Supervisors", value: dashboardData.supervisors, icon: <FaCogs />, color: "from-green-500 to-green-700" },
    { label: "Technicians", value: dashboardData.technicians, icon: <FaClipboardList />, color: "from-orange-500 to-orange-700" },
    { label: "Complaints", value: dashboardData.complaints, icon: <FaExclamationCircle />, color: "from-red-500 to-red-700" },
    { label: "Job Slips", value: dashboardData.jobSlips, icon: <FaClipboardCheck />, color: "from-purple-500 to-purple-700" },
    { label: "Janitorial Reports", value: dashboardData.janitorialReports, icon: <MdCleanHands />, color: "from-yellow-500 to-yellow-700" },
    { label: "Security Reports", value: dashboardData.securityReports, icon: <MdSecurity />, color: "from-indigo-500 to-indigo-700" },
    { label: "CCTV Reports", value: dashboardData.cctvReports, icon: <MdCameraAlt />, color: "from-teal-500 to-teal-700" },
  ];
  if (loading) {
    return (
      <Layout>
        <h2 className="text-3xl font-semibold">Loading...</h2>
      </Layout>
    );
  }
  return (
    <Layout>
  <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>
<AuthComponent></AuthComponent>
  {/* Overview Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {cardData.map((item, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg shadow-lg bg-gradient-to-br ${item.color} text-white flex items-center transition-transform transform hover:scale-105`}
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="text-4xl">{item.icon}</div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{item.label}</h3>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>

    {/* ZK_BIO Attendance DashBoard */}
    {role !== 'technician' && (
  <div className="space-y-4"> {/* Controls spacing between components */}
    <AttendanceDashboard />
    {/* Your existing graphs */}
  </div>
)}


{/* Hide graphs for technicians */}
{role !== 'technician' && (
  <>
  {/* 🔥 Modernized Pie Charts Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Feedback Complaints by Status */}
    <div className="p-8 bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">Feedback Complaints</h3>
      <div className="h-[350px] w-full flex justify-center">
        <Pie
          data={pieData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => handlePieClick(event, elements, pieData, feedbackData, "feedback"),
          }}
        />
      </div>
    </div>

    {/* Job Slips by Status */}
    <div className="p-8 bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">Job Slips</h3>
      <div className="h-[350px] w-full flex justify-center">
        <Pie
          data={jobSlipPieData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => handlePieClick(event, elements, jobSlipPieData, jobSlipDataState, "jobSlip"),
          }}
        />
      </div>
    </div>
  </div>

  {/* 🔥 Modernized Bar Graphs Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Reports Overview */}
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-3xl border border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">Reports Overview</h3>
      <div className="h-[350px] w-full flex justify-center">
        <Bar
          data={barData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const clickedIndex = elements[0].index;
                const clickedLabel = barData.labels[clickedIndex];

                if (clickedLabel === 'Complaints') {
                  window.location.href = '/customer-relation/feedback-complain';
                } else if (clickedLabel === 'Job Slips') {
                  window.location.href = '/customer-relation/job-slip';
                } else if (clickedLabel === 'Janitorial Reports') {
                  window.location.href = '/janitorial/report';
                }
              }
            },
          }}
        />
      </div>
    </div>

    {/* Security Overview */}
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-3xl border border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">Security Overview</h3>
      <div className="h-[350px] w-full flex justify-center">
        <Bar
          data={barData2}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const clickedIndex = elements[0].index;
                const clickedLabel = barData2.labels[clickedIndex];

                if (clickedLabel === 'Security Reports') {
                  window.location.href = '/security-services/security-reports';
                } else if (clickedLabel === 'CCTV Reports') {
                  window.location.href = '/security-services/cctv-report';
                }
              }
            },
          }}
        />
      </div>
    </div>
  </div>
</>
)}
{/* Modern Popup */}
{popupVisible && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50 transition-all duration-300">
    <div className="bg-white border border-gray-200 shadow-2xl p-8 rounded-3xl max-w-3xl w-full transform scale-100 hover:scale-105 transition-all duration-300 ease-in-out">
      <h4 className="text-3xl font-semibold text-gray-900 mb-6">Details</h4>

      {/* Table Container */}
      <div className="max-h-80 overflow-y-auto rounded-lg shadow-inner">
        <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="border px-5 py-3">ID</th>
              <th className="border px-5 py-3">No</th>
              <th className="border px-5 py-3">Tenant ID</th>
              <th className="border px-5 py-3">Attended By</th>
              <th className="border px-5 py-3">Floor</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {popupData.map((item, index) => {
              const isComplaint = 'tenantId' in item;
              return (
                <tr
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  onClick={() => {
                    const targetPath = isComplaint
                      ? `/customer-relation/feedback-complain/view/${item.id}`
                      : `/customer-relation/job-slip/view/${item.id}`;
                    window.location.href = targetPath;
                  }}
                >
                  <td className="border px-5 py-3">{item.id}</td>
                  <td className="border px-5 py-3">{item.complainNo}</td>
                  <td className="border px-5 py-3">{item.tenantId || '-'}</td>
                  <td className="border px-5 py-3">{item.attendedBy || '-'}</td>
                  <td className="border px-5 py-3">{item.floorNo || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Close Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setPopupVisible(false)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:from-red-600 hover:to-red-800 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


       
       
  
       
        </Layout>


  );
};

export default Home;


