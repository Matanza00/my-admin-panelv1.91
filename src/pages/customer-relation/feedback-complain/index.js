import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';
import prisma from '../../../lib/prisma';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';
import { getSession } from 'next-auth/react';

export default function FeedbackComplainPage({ initialData, nextPage ,userTenant }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    complainNo: '',
    dateFrom: '',
    dateTo: '',
    complainBy: '',
    floorNo: '',
    listServices: '',
    attendedBy: '',
    status: '',
  });

  // Toggle filter section
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  // Client-side filtering as an extra security measure
  const filteredData = Array.isArray(data) ? data.filter((item) => item.tenant === userTenant) : [];
  console.log("🔹 Raw Data:", data);
console.log("🔹 User Tenant:", userTenant);


const applyFilters = async () => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value) // Remove empty filters
  );

  // Convert filters to query parameters
  const query = new URLSearchParams(activeFilters).toString();

  try {
    console.log("🔹 Sending Filter Request:", `/api/feedbackcomplain?${query}`);
    const res = await fetch(`/api/feedbackcomplain?${query}`);

    if (!res.ok) {
      throw new Error("Failed to fetch filtered data");
    }

    const filteredResponse = await res.json();
    console.log("🔹 Filtered Data Received:", filteredResponse);

    setData(filteredResponse || []);
    setPage(1);
    setHasMore(false);
  } catch (error) {
    console.error("❌ Error applying filters:", error);
  }
};


console.log("🟢 UI Rendering Data:", data);

useEffect(() => {
  console.log("🟢 Updated Data in State:", data);
}, [data]);

  

  // Load more data for pagination
  const loadMoreData = async () => {
    const res = await fetch(`/api/feedbackcomplain?page=${page + 1}`);
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
    const selectedStatus = filters.status; // Get selected status from the filters
  
    if (!from || !to) {
      alert('Please select both "From" and "To" dates.');
      return;
    }
  
    // Fetch data from the Feedback Reports endpoint with the status filter
    const query = new URLSearchParams({
      from,
      to,
      status: selectedStatus, // Add the status to the query
    }).toString();
  
    const res = await fetch(`/api/monthexport/feedback?${query}`);
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
    const rows = data.map((feedback) => ({
      ID: feedback.id,
      ComplainNo: feedback.complainNo,
      Date: new Date(feedback.date).toLocaleDateString(),
      FloorNo: feedback.floorNo,
      Area: feedback.area,
      Location: feedback.location,
      Services: feedback.listServices,
      MaterialRequired: feedback.materialReq,
      ActionTaken: feedback.actionTaken,
      AttendedBy: feedback.attendedBy,
      Remarks: feedback.remarks,
      Status: feedback.status,
      ComplainBy: feedback.complainBy || 'N/A',
      Tenant: feedback.tenant ? feedback.tenant.name : 'N/A',  // Default to 'N/A' if tenant is null
    }));
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 80 },  // ID
      { wpx: 100 }, // Complain No
      { wpx: 120 }, // Date
      { wpx: 100 }, // Floor No
      { wpx: 100 }, // Area
      { wpx: 100 }, // Location
      { wpx: 150 }, // Services
      { wpx: 200 }, // Material Required
      { wpx: 200 }, // Action Taken
      { wpx: 150 }, // Attended By
      { wpx: 250 }, // Remarks
      { wpx: 100 }, // Status
      { wpx: 150 }, // Complain By
      { wpx: 150 }, // Tenant
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Feedback Reports');
    XLSX.writeFile(wb, 'feedbackreports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Feedback Reports', 14, 10);
  
    // Add headers for the Feedback data
    const headers = [
      'ID', 'Complain No', 'Date', 'Floor No', 'Area', 'Location', 'Services', 
      'Material Required', 'Action Taken', 'Attended By', 'Remarks', 'Status', 'Complain By', 'Tenant'
    ];
  
    // Create the table data for each feedback report
    const tableData = data.map((feedback) => [
      feedback.id,
      feedback.complainNo,
      new Date(feedback.date).toLocaleDateString(),
      feedback.floorNo,
      feedback.area,
      feedback.location,
      feedback.listServices,
      feedback.materialReq,
      feedback.actionTaken,
      feedback.attendedBy,
      feedback.remarks,
      feedback.status,
      feedback.complainBy || 'N/A',
      feedback.tenant ? feedback.tenant.name : 'N/A',  // Default to 'N/A' if tenant is null
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('feedbackreports.pdf');
  };
  console.log("🔍 Logged-in User Tenant:", userTenant); // ✅ Debug: Ensure tenant is received
  
  if (!data || data.length === 0) {
    return <Layout>      <div className="p-4">
    <h1 className="text-2xl font-semibold mb-6">Feedback / Complaints</h1>

    {/* Full-width Filter Button */}
    <button
      onClick={toggleFilter}
      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-900 transition-all duration-300"
    >
      <span className="text-lg">Filter</span>
      <HiFilter className="text-lg" />
    </button>

    {/* Collapsible Filter Section */}
    {isFilterOpen && (
      <div className="bg-gray-800 text-white p-6 rounded-lg mb-4">
        <h2 className="font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Complain No */}
          <input
            type="text"
            placeholder="Complain No"
            name="complainNo"
            value={filters.complainNo}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* Date Range */}
          <input
            type="date"
            placeholder="Date From"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />
          <input
            type="date"
            placeholder="Date To"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* Complain By */}
          <input
            type="text"
            placeholder="Complain By"
            name="complainBy"
            value={filters.complainBy}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* Floor No */}
          <input
            type="text"
            placeholder="Floor No"
            name="floorNo"
            value={filters.floorNo}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* List Services Dropdown */}
          <select
            name="listServices"
            value={filters.listServices}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          >
            <option value="">Select Service</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            {/* Add other services as needed */}
          </select>

          {/* Attended By */}
          <input
            type="text"
            placeholder="Attended By"
            name="attendedBy"
            value={filters.attendedBy}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* Status Dropdown */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Apply Filters
        </button>
      </div>
    )}

    {/* Add More Complain Button */}
    <div className="mb-6 mt-4">
      <Link href="/customer-relation/feedback-complain/add">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
          Add More Complaint
        </button>
      </Link>
    </div>
    
    </div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Feedback / Complaints</h1>

        {/* Full-width Filter Button */}
        <button
          onClick={toggleFilter}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-900 transition-all duration-300"
        >
          <span className="text-lg">Filter</span>
          <HiFilter className="text-lg" />
        </button>

        {/* Collapsible Filter Section */}
        {isFilterOpen && (
          <div className="bg-gray-800 text-white p-6 rounded-lg mb-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Complain No */}
              <input
                type="text"
                placeholder="Complain No"
                name="complainNo"
                value={filters.complainNo}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

              {/* Date Range */}
              <input
                type="date"
                placeholder="Date From"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />
              <input
                type="date"
                placeholder="Date To"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

              {/* attended By */}
              <input
                type="text"
                placeholder="attended By"
                name="attendedBy"
                value={filters.attendedBy}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

              
              {/* Status Dropdown */}
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In%20Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <button
              onClick={applyFilters}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Add More Complain Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/customer-relation/feedback-complain/add">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
              Add More Complaint
            </button>
          </Link>

        <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-10 py-3 rounded-md hover:bg-blue-700"
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
        
        {/* Status Dropdown for Export */}
        <select
          value={filters.status}
          onChange={handleFilterChange} // Use handleFilterChange to update the status filter
          name="status"
          className="w-full px-4 text-gray-900 py-2 border rounded-md"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
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

        {/* Complaints Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
      <div
        key={item.id}
        className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-800">{item.complain}</h2>
        <p className="text-gray-600 mb-1"><strong>Complain No:</strong> {item.complainNo}</p>
        <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>

        {/* Tenant Name */}
        {item.tenant && item.tenant.tenantName && (
          <p className="text-gray-600 mb-1"><strong>Tenant:</strong> {item.tenant.tenantName}</p>
        )}


        {item.floorNo && (
          <p className="text-gray-600 mb-1"><strong>Floor No:</strong> {item.floorNo}</p>
        )}
        {item.listServices && (
          <p className="text-gray-600 mb-1"><strong>List Services:</strong> {item.listServices}</p>
        )}
        {item.attendedBy && (
          <p className="text-gray-600 mb-1"><strong>Attended By:</strong> {item.attendedBy}</p>
        )}

        <p className="text-gray-600 mb-1"><strong>Status:</strong> {item.status}</p>

        {/* Actions */}
        <div className="flex space-x-4 mt-4">
          <Link href={`/customer-relation/feedback-complain/view/${item.id}`}>
            <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
              <HiEye className="mr-1" /> View
            </div>
          </Link>
          <Link href={`/customer-relation/feedback-complain/edit/${item.id}`}>
            <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
              <HiOutlinePencil className="mr-1" /> Edit
            </div>
          </Link>
          <button className="text-red-600 flex items-center cursor-pointer">
            <HiOutlineTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
    ))}

        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          {hasMore && (
            <button
              onClick={loadMoreData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Load More
            </button>
          )}
        </div>
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

  // If the user is an admin, supervisor, or super_admin, allow viewing all complaints
  if (["super_admin", "admin", "supervisor"].includes(normalizedRole)) {
    whereCondition = {}; // Show all feedback complaints
  } 
  // If the user is a tenant, ensure they can only view their own complaints
  else if (normalizedRole === "tenant") {
    console.log("Tenant user detected. Fetching tenant-specific complaints.");

    // Convert the session userId into an integer to avoid Prisma validation error
    const tenantId = parseInt(id, 10); // Ensure the userId is an integer

    // Fetch tenant information
    const tenant = await prisma.tenants.findFirst({
      where: { userId: tenantId }, // Use findFirst if userId is not unique
    });

    if (!tenant) {
      console.error(`Tenant not found for userId: ${tenantId}`);
      return { redirect: { destination: "/auth/signin", permanent: false } };
    }

    console.log("Tenant found:", tenant);

    // Fetch feedback complaints that match the tenant's id
    whereCondition = { tenantId: tenant.id }; // Ensure complaints belong to this tenant

    // Additionally, ensure that only the user corresponding to the tenant's userId can view it
    whereCondition = {
      ...whereCondition,
      tenantId: tenant.id,
      tenant: {
        userId: tenantId, // Ensure the tenant's userId matches the logged-in user's id
      },
    };
  } 
  // If the user is a technician, search for complaints they have attended to
  else if (normalizedRole === "technician") {
    const jobSlips = await prisma.jobSlip.findMany({
      where: {
        attendedBy: {
          contains: `${id}`, // Check if technician ID exists in attendedBy field
        },
      },
      select: { feedbackComplainId: true },
    });

    const complaintIds = jobSlips.map((job) => job.feedbackComplainId);
    whereCondition = { id: { in: complaintIds } };
  }

  // Fetch the feedback complaints based on whereCondition
  const feedbackComplains = await prisma.feedbackComplain.findMany({
    where: whereCondition,
    orderBy: { date: "desc" },
    include: {
      tenant: true, // Include tenant data if necessary
    },
  });

  const serializedData = feedbackComplains.map((item) => ({
    id: item.id,
    complain: item.complain,
    complainNo: item.complainNo,
    date: item.date.toISOString(),
    tenantId: item.tenantId,
    tenantName: item.tenant ? item.tenant.tenantName : "N/A", // Include tenant name if available
    status: item.status,
    attendedBy: item.attendedBy,
  }));

  return {
    props: {
      initialData: serializedData,
    },
  };
}





