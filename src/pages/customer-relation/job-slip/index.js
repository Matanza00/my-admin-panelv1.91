// pages/customer-relation/job-slip/index.js
import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';
import prisma from '../../../lib/prisma';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function JobSlipPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobId: '',
    dateFrom: '',
    dateTo: '',
    complainNo: '',
    attendedBy: '',
    floorNo: '',
    status: '',
  });
  const [exportFormat, setExportFormat] = useState('excel'); // Add state for export format

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
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

  // Apply filters to load data
  

const applyFilters = async () => {
  try {
    // 🔹 Step 1: Get JWT Token from session
    const session = await getSession(); // ✅ Get session safely

    if (!session || !session.user?.accessToken) {
      console.error("❌ JWT Token is missing in session!");
      alert("You are not authenticated. Please log in again.");
      return;
    }

    const token = session.user.accessToken; // ✅ Extract JWT Token
    console.log("🔹 Using Token:", token);

    // 🔹 Step 2: Remove empty filters before sending request
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    );

    const query = new URLSearchParams(activeFilters).toString();
    console.log("🔹 Sending Filter Request to:", `/api/job-slip?${query}`);

    // 🔹 Step 3: Send request with JWT token in headers
    const res = await fetch(`/api/job-slip?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Send JWT token
      },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message || "Failed to fetch filtered data");
    }

    const filteredResponse = await res.json();
    console.log("🟢 Filtered Data Received:", filteredResponse);

    // ✅ Step 4: Update UI Immediately
    setData(filteredResponse.data || []);
    setPage(1);
    setHasMore(filteredResponse.nextPage);
  } catch (error) {
    console.error("❌ Error applying filters:", error.message);
    alert(`Error: ${error.message}`);
  }
};

  
  
  

  // Load more data for pagination
  const loadMoreData = async () => {
    const res = await fetch(`/api/customer-relation/job-slip?page=${page + 1}`);
    const { data: newData, nextPage } = await res.json();

    setData((prevData) => [...prevData, ...newData]);
    setPage(page + 1);
    setHasMore(nextPage);
  };

  if (!data || data.length === 0) {
    return <Layout><div className="p-4">No data available</div>
    <button
    onClick={() => window.location.reload()}
    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
  >
    Back
  </button>
  </Layout>;
    
  }


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
  
    const res = await fetch(`/api/monthexport/jobslip?${query}`);
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
    const rows = data.map((job) => ({
      ID: job.id,
      JobId: job.jobId,
      ComplainNo: job.complainNo,
      Date: new Date(job.date).toLocaleDateString(),
      FloorNo: job.floorNo,
      Area: job.area,
      ComplaintDesc: job.complaintDesc,
      MaterialRequired: job.materialReq,
      ActionTaken: job.actionTaken,
      AttendedBy: job.attendedBy,
      Department: job.department,
      Remarks: job.remarks,
      Status: job.status,
      SupervisorApproval: job.supervisorApproval ? 'Approved' : 'Pending',
      ManagementApproval: job.managementApproval ? 'Approved' : 'Pending',
    }));
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 80 },  // ID
      { wpx: 100 }, // Job ID
      { wpx: 100 }, // Complain No
      { wpx: 120 }, // Date
      { wpx: 100 }, // Floor No
      { wpx: 100 }, // Area
      { wpx: 150 }, // Complaint Description
      { wpx: 200 }, // Material Required
      { wpx: 200 }, // Action Taken
      { wpx: 150 }, // Attended By
      { wpx: 150 }, // Department
      { wpx: 250 }, // Remarks
      { wpx: 100 }, // Status
      { wpx: 150 }, // Supervisor Approval
      { wpx: 150 }, // Management Approval
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Job Slip Reports');
    XLSX.writeFile(wb, 'jobslipreports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Job Slip Reports', 14, 10);
  
    // Add headers for the Job Slip data
    const headers = [
      'ID', 'Job ID', 'Complain No', 'Date', 'Floor No', 'Area', 'Complaint Desc', 
      'Material Required', 'Action Taken', 'Attended By', 'Department', 'Remarks', 'Status', 
      'Supervisor Approval', 'Management Approval'
    ];
  
    // Create the table data for each job slip report
    const tableData = data.map((job) => [
      job.id,
      job.jobId,
      job.complainNo,
      new Date(job.date).toLocaleDateString(),
      job.floorNo,
      job.area,
      job.complaintDesc,
      job.materialReq,
      job.actionTaken,
      job.attendedBy,
      job.department,
      job.remarks,
      job.status,
      job.supervisorApproval ? 'Approved' : 'Pending',
      job.managementApproval ? 'Approved' : 'Pending',
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('jobslipreports.pdf');
  };
  
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Job Slips</h1>

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
              {/* Job ID */}
              <input
                type="text"
                placeholder="Job ID"
                name="jobId"
                value={filters.jobId}
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

              {/* Complain No */}
              <input
                type="text"
                placeholder="Complain No"
                name="complainNo"
                value={filters.complainNo}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

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
                <option value="In Progress">In Progress</option>
                <option value="Verified & Closed">Verified & Closed</option>
              </select>
            </div>
            {/* Buttons for Apply, Clear, and Back */}
<div className="mt-4 flex gap-4">
  <button
    onClick={applyFilters}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
  >
    Apply Filters
  </button>

  <button
    onClick={() => setFilters({ jobId: '', complainNo: '', attendedBy: '', dateFrom: '', dateTo: '', status: '' })}
    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
  >
    Clear Filters
  </button>

  {!data.length && (
    <button
      onClick={() => window.location.reload()}
      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
    >
      Back
    </button>
  )}
</div>


          </div>
        )}
        {/* Add More Complain Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/customer-relation/job-slip/add">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
              Add Jobslip
            </button>
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
          <option value="Verified & Closed">Verified & Closed</option>
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


        {/* Job Slips Card Grid */}
        <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{item.jobId}</h2>
              <p className="text-gray-600 mb-1"><strong>Complain No:</strong> {item.complainNo}</p>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-1"><strong>Attended By:</strong> {item.attendedBy}</p>
              <p className="text-gray-600 mb-1"><strong>Status:</strong> {item.status}</p>

              {/* Actions */}
              <div className="flex space-x-4 mt-4">
                <Link href={`/customer-relation/job-slip/view/${item.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-1" /> View
                  </div>
                </Link>
                <Link href={`/customer-relation/job-slip/edit/${item.id}`}>
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


import { getSession, useSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }

  const { role, id } = session.user; // Get user role and ID
  const limit = 10;
  let whereCondition = {};

  if (role === "tenant") {
    // Fetch job slips linked to complaints from the tenant
    whereCondition = {
      feedbackComplain: {
        tenant: {
          id: id, // Ensure tenantId matches logged-in tenant
        },
      },
    };
  } else if (role === "technician") {
    whereCondition = {
      attendedBy: { contains: String(id) },
    };
  } else if (role === "super_admin" || role === "admin" || role === "supervisor") {
    // Fetch all job slips for these roles
    whereCondition = {};
  }

  const jobSlips = await prisma.jobSlip.findMany({
    where: whereCondition,
    skip: 0,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      feedbackComplain: {
        select: {
          complainNo: true,
          tenant: {
            select: { tenantName: true },
          },
        },
      },
    },
  });

  // ✅ Step 1: Fetch Attended By Names & Department Names
  const jobSlipsWithDetails = await Promise.all(
    jobSlips.map(async (item) => {
      // Handle attendedBy: only numeric single IDs
      let attendedByName = 'N/A';
      if (item.attendedBy) {
        // If multiple technician IDs are stored, pick the first numeric one
        const ids = item.attendedBy.split(',').map(s => s.trim());
        const validIdStr = ids.find(s => /^\d+$/.test(s));
        if (validIdStr) {
          const idNum = Number(validIdStr);
          const attendedUser = await prisma.user.findUnique({
            where: { id: idNum },
            select: { name: true },
          });
          if (attendedUser?.name) attendedByName = attendedUser.name;
        }
      }

      // Handle department: numeric check
      let departmentName = "N/A";
      if (item.department && /^\d+$/.test(String(item.department))) {
        const dept = await prisma.department.findUnique({
          where: { id: Number(item.department) },
          select: { name: true },
        });
        if (dept?.name) departmentName = dept.name;
      }

      return {
        id: item.id,
        date: item.date.toISOString(),
        jobId: item.jobId,
        complainNo: item.complainNo,
        complainBy: item.complainBy || "N/A",
        floorNo: item.floorNo,
        area: item.area,
        inventoryRecieptNo: item.inventoryRecieptNo || "N/A",
        location: item.location,
        complaintDesc: item.complaintDesc,
        materialReq: item.materialReq,
        actionTaken: item.actionTaken,
        attendedBy: attendedByName, // Replace ID with Name
        department: departmentName, // Replace ID with Name
        remarks: item.remarks,
        completed_At: item.completed_At ? item.completed_At.toISOString() : null,
        status: item.status,
        supervisorApproval: item.supervisorApproval,
        managementApproval: item.managementApproval,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        picture: item.picture ? item.picture.split(",") : [], // Convert stored string URLs into an array
        tenant: item.feedbackComplain?.tenant?.tenantName || "N/A",
      };
    })
  );

  console.log("✅ Processed Data:", jobSlipsWithDetails);

  const nextPage = jobSlipsWithDetails.length === limit;

  return {
    props: {
      initialData: jobSlipsWithDetails,
      nextPage,
    },
  };
}

