import { useState } from "react";
import Link from "next/link";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Layout from "../../../components/layout";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function FirefightingDutyPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage || false);

  const [filters, setFilters] = useState({
    shift: "",
    date: "",
    users: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ page: 1, ...filters }).toString();
    try {
      const res = await fetch(`/api/firefighting-duty?${query}`);
      if (!res.ok) throw new Error("Failed to fetch filtered data");

      const { data: newData, nextPage } = await res.json();
      setData(newData);
      setPage(1);
      setHasMore(nextPage);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1, ...filters }).toString();
    try {
      const res = await fetch(`/api/firefighting-duty?${query}`);
      if (!res.ok) throw new Error("Failed to load more data");

      const { data: newData, nextPage } = await res.json();
      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(nextPage);
    } catch (error) {
      console.error("Error loading more data:", error);
    }
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
  
    // Use the new URL for the API request
    const res = await fetch(`/api/monthexport/firefightingduty?from=${from}&to=${to}`);
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
    const rows = data.map((report) => ({
      ID: report.id,
      Date: new Date(report.date).toLocaleDateString(),
      Shift: report.shift,
      Users: report.users.map(user => user.name).join(', '), // Joining user names
    }));
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 80 },  // ID
      { wpx: 100 }, // Date
      { wpx: 100 }, // Shift
      { wpx: 150 }, // Users
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Firefighting Duty Reports');
    XLSX.writeFile(wb, 'firefighting-duty-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Firefighting Duty Reports', 14, 10);
  
    // Add headers for the firefighting duty data
    const headers = [
      'ID', 'Date', 'Shift', 'Users'
    ];
  
    // Create the table data for each report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      report.shift,
      report.users.map(user => user.name).join(', '), // Joining user names
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('firefighting-duty-reports.pdf');
  };
  
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Firefighting Duty Records</h1>
        <Link href="/security-services/firefighting-duty/add">
          <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ">
            Add New Record
          </button>
        </Link>

        <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Export Options
          </button>
        
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
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              name="shift"
              value={filters.shift}
              onChange={handleFilterChange}
              placeholder="Shift"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              placeholder="Date"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="users"
              value={filters.users}
              onChange={handleFilterChange}
              placeholder="User ID"
              className="px-4 py-2 border rounded-md"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Firefighting Duty Card Grid */}
        <div>
          {data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((duty) => (
                <div
                  key={duty.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">Shift: {duty.shift}</h2>
                  <p>
                    <strong>Date:</strong> {new Date(duty.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>User Count:</strong> {duty.userCount}
                  </p>
                  <p>
                    <strong>Users:</strong> {duty.users.map((user) => user.name).join(", ")}
                  </p>
                  <div className="flex space-x-6 mt-4">
                    <Link href={`/security-services/firefighting-duty/view/${duty.id}`}>
                      <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                        <HiEye className="mr-2" /> View
                      </div>
                    </Link>
                    <Link href={`/security-services/firefighting-duty/edit/${duty.id}`}>
                      <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
                        <HiOutlinePencil className="mr-2" /> Edit
                      </div>
                    </Link>
                    <div className="text-red-600 hover:text-red-800 flex items-center cursor-pointer">
                      <HiOutlineTrash className="mr-2" /> Delete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No records found.</p>
          )}
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

export async function getServerSideProps({ query }) {
  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/firefightingduty?${new URLSearchParams(query).toString()}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const { data: duties, nextPage } = await res.json();

    return {
      props: {
        initialData: duties,
        nextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching Firefighting Duty data in getServerSideProps:", error);

    return {
      props: {
        initialData: [],
        nextPage: false,
      },
    };
  }
}
