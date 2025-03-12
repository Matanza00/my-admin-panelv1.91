import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';
import prisma from '../../../lib/prisma';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';
import { getSession } from 'next-auth/react'; // If using next-auth

export default function JanitorialReportPage({ initialData, nextPage, user }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    supervisor: '',
    dateFrom: '',
    dateTo: '',
  });

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ ...filters, page: 1 }).toString();
    const res = await fetch(`/api/janitorial-report?${query}`);
    const { data: filteredData, nextPage } = await res.json();

    setData(filteredData);
    setPage(1);
    setHasMore(nextPage);
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({
      ...filters,
      page: page + 1,
    }).toString();
    const res = await fetch(`/api/janitorial-report?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData((prevData) => [...prevData, ...newData]);
    setPage(page + 1);
    setHasMore(nextPage);
  };

  const [exportFormat, setExportFormat] = useState('excel'); // Add state for export format

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };
  const handleExport = async () => {
    const { from, to } = dateRange;
  
    if (!from || !to) {
      alert('Please select both "From" and "To" dates.');
      return;
    }
  
    // Fetch data from the Janitorial Report endpoint
    const res = await fetch(`/api/monthexport/janitorialreport?from=${from}&to=${to}`);
    if (!res.ok) {
      console.error('Failed to fetch export data');
      return;
    }
  
    const data = await res.json();
  
    if (exportFormat === 'excel') {
      const excelData = convertToExcelData(data);
      exportToExcel(excelData);
    } else if (exportFormat === 'pdf') {
      exportToPDF(data);
    }
  };
  
  const convertToExcelData = (data) => {
    const rows = data.map((report) => {
      const subReports = report.subJanReport.map((sub) => ({
        FloorNo: sub.floorNo,
        Toilet: sub.toilet,
        Lobby: sub.lobby,
        Staircase: sub.staircase,
      }));
  
      return {
        ID: report.id,
        Date: new Date(report.date).toLocaleDateString(),
        Supervisor: report.supervisor,
        Tenant: report.tenant,
        Remarks: report.remarks,
        SubReports: subReports.map(
          (sub) =>
            `Floor: ${sub.FloorNo}, Toilet: ${sub.Toilet}, Lobby: ${sub.Lobby}, Staircase: ${sub.Staircase}`
        ).join('; '),
      };
    });
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 80 },  // ID
      { wpx: 120 }, // Date
      { wpx: 100 }, // Supervisor
      { wpx: 100 }, // Tenant
      { wpx: 200 }, // Remarks
      { wpx: 300 }, // SubReports
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Janitorial Reports');
    XLSX.writeFile(wb, 'janitorialreports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Janitorial Report', 14, 10);
  
    // Add headers for the Janitorial Report data
    const headers = [
      'ID', 'Date', 'Supervisor', 'Tenant', 'Remarks', 'SubReports'
    ];
  
    // Create the table data for each janitorial report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      report.supervisor,
      report.tenant,
      report.remarks,
      report.subJanReport
        .map(
          (sub) =>
            `Floor: ${sub.floorNo}, Toilet: ${sub.toilet}, Lobby: ${sub.lobby}, Staircase: ${sub.staircase}`
        )
        .join('; '),
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('janitorialreports.pdf');
  };
  const userRole = user?.role || "guest"; // Fallback if role is undefined
  console.log(data)
  
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Janitorial Inspection Report</h1>

        {/* Filter Button */}
        {/* <button
          onClick={toggleFilter}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg flex justify-between items-center hover:bg-indigo-700 transition duration-300 mb-6"
        >
          <span className="text-lg">Filters</span>
          <HiFilter className="text-lg" />
        </button> */}

        {/* Collapsible Filter Section */}
        {isFilterOpen && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="font-semibold text-xl mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder="Supervisor"
                name="supervisor"
                value={filters.supervisor}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={applyFilters}
              className="mt-4 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Add Janitorial Report Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link
            href="/janitorial/report/add"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300"
          >
            + Add New Janitorial Report
          </Link>
    
          <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Export Options
          </button>
                </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Export Options</h2>
                <button onClick={toggleModal} className="text-gray-600">
                  <HiOutlineX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleDateChange}
                  className="w-full px-4 text-gray-900 py-2 border rounded-md"
                />
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateChange}
                  className="w-full px-4 text-gray-900 py-2 border rounded-md"
                />
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-4 text-gray-900 py-2 border rounded-md"
                >
                  <option value="excel">Export as Excel</option>
                  <option value="pdf">Export as PDF</option>
                </select>
                <button
                  onClick={handleExport}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Janitorial Report Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((report) => (
  <div key={report.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold mb-2 text-gray-800">{report.supervisor}</h2>
    <p className="text-gray-600 mb-2"><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
    <p className="text-gray-600 mb-2"><strong>Tenant:</strong> {report.tenant}</p>
    <p className="text-gray-600 mb-2"><strong>Remarks:</strong> {report.remarks}</p>

    

    <div className="flex space-x-6 mt-4">
      {/* Everyone can View */}
      <Link href={`/janitorial/report/view/${report.id}`}>
        <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
          <HiEye className="mr-2" /> View
        </div>
      </Link>

      {/* Only Supervisor/Admin/Superadmin can Edit */}
      {['admin', 'superadmin', 'supervisor'].includes(userRole) && (
        <Link href={`/janitorial/report/edit/${report.id}`}>
          <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
            <HiOutlinePencil className="mr-2" /> Edit
          </div>
        </Link>
      )}

      {/* Only Supervisor/Admin/Superadmin can Delete */}
      {['admin', 'superadmin', 'supervisor'].includes(userRole) && (
        <div className="text-red-600 hover:text-red-800 flex items-center cursor-pointer">
          <HiOutlineTrash className="mr-2" /> Delete
        </div>
      )}
    </div>
  </div>
))}
        </div>

        {/* Pagination */}
        {hasMore ? (
          <div className="mt-8 text-center">
            <button
              onClick={loadMoreData}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Load More
            </button>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">No more records to load.</div>
        )}
      </div>
    </Layout>
  );
}



export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }

  const { role, id } = session.user;
  const normalizedRole = role.toLowerCase();
  console.log("normalized role", normalizedRole); // Ensure consistent role handling

  let whereCondition = {};

  // If the user is an admin, supervisor, or super_admin, allow viewing all reports
  if (["super_admin", "admin", "supervisor"].includes(normalizedRole)) {
    whereCondition = {}; // Show all janitorial reports
  } 
  // If the user is a tenant, ensure they can only view their own reports
  else if (normalizedRole === "tenant") {
    console.log("Tenant user detected. Fetching tenant-specific reports.");

    // Convert the session userId into an integer to avoid Prisma validation error
    const tenantId = parseInt(id, 10); // Ensure the userId is an integer

    if (isNaN(tenantId)) {
      console.error("Invalid tenant ID:", id);
      return { redirect: { destination: "/auth/signin", permanent: false } };
    }

    // Fetch tenant information
    const tenant = await prisma.tenants.findFirst({
      where: { userId: tenantId }, // Use the userId to match the tenant's info
    });

    if (!tenant) {
      console.error(`Tenant not found for userId: ${tenantId}`);
      return { redirect: { destination: "/auth/signin", permanent: false } };
    }

    console.log("Tenant found:", tenant);

    // Fetch janitorial reports where tenantName matches
    whereCondition = { tenant: tenant.tenantName }; // Use tenantName for filtering reports

  } 
  // If the user is a technician, search for reports they have attended to
  else if (normalizedRole === "technician") {
    const jobSlips = await prisma.jobSlip.findMany({
      where: {
        attendedBy: {
          contains: `${id}`, // Check if technician ID exists in attendedBy field
        },
      },
      select: { janitorialReportId: true },
    });

    const reportIds = jobSlips.map((job) => job.janitorialReportId);
    whereCondition = { id: { in: reportIds } };
  }

  // Fetch the janitorial reports based on whereCondition
  const janitorialReports = await prisma.janitorialReport.findMany({
  where: whereCondition,
  orderBy: { date: "desc" },
  include: {
    subJanReport: true, // Include sub-reports if necessary
  },
});

// Fetch supervisor details for each report
const serializedData = await Promise.all(
  janitorialReports.map(async (item) => {
    let supervisorName = "Unknown Supervisor";

    if (item.supervisor) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(item.supervisor) },  // ✅ Fetch supervisor details from User table
        select: { name: true },
      });
      if (user) supervisorName = user.name;
    }

    return {
      id: item.id,
      date: item.date.toISOString(),
      supervisor: supervisorName,  // ✅ Replacing supervisorId with supervisorName
      supervisorName:supervisorName,
      tenant: item.tenant,
      remarks: item.remarks,
      subReports: item.subJanReport.map(sub => ({
        floorNo: sub.floorNo,
        toilet: sub.toilet,
        lobby: sub.lobby,
        staircase: sub.staircase,
      })),
    };
  })
);

console.log("1211", serializedData);


  return {
    props: {
      initialData: serializedData,
    },
  };
}













