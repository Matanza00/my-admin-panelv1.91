import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';
// import prisma from '../../../lib/prisma';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function SecurityReportPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    observedBy: '',
    supervisor: '',
    dateFrom: '',
    dateTo: '',
    description: '',
  });

  // Toggle filter section
  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters to load data
  const applyFilters = async () => {
    const query = new URLSearchParams({ ...filters, page: 1 }).toString();
    const res = await fetch(`/api/security-reports?${query}`);
    const { data: filteredData, nextPage } = await res.json();

    setData(filteredData);
    setPage(1);
    setHasMore(nextPage);
  };

  // Load more data for pagination
  const loadMoreData = async () => {
    const res = await fetch(`/api/security-reports?page=${page + 1}`);
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
  
    // Use the new URL for the API request
    const res = await fetch(`/api/monthexport/securityreports?from=${from}&to=${to}`);
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
      ObservedBy: report.observedBy,
      Supervisor: report.supervisor,
      Description: report.description,
      Action: report.action,
      TimeNoted: new Date(report.timeNoted).toLocaleString(),
      TimeSolved: new Date(report.timeSolved).toLocaleString(),
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
      { wpx: 150 }, // ObservedBy
      { wpx: 150 }, // Supervisor
      { wpx: 200 }, // Description
      { wpx: 200 }, // Action
      { wpx: 120 }, // TimeNoted
      { wpx: 120 }, // TimeSolved
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Security Reports');
    XLSX.writeFile(wb, 'security-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Security Reports', 14, 10);
  
    // Add headers for the security report data
    const headers = [
      'ID', 'Date', 'Observed By', 'Supervisor', 'Description', 'Action', 'Time Noted', 'Time Solved'
    ];
  
    // Create the table data for each report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      report.observedBy,
      report.supervisor,
      report.description,
      report.action,
      new Date(report.timeNoted).toLocaleString(),
      new Date(report.timeSolved).toLocaleString(),
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('security-reports.pdf');
  };
  


  if (!data || data.length === 0) {
    return (
      <Layout>
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-6">Security Reports</h1>
  
          {/* Filter Button */}
          {/* <button
            onClick={toggleFilter}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-900 transition-all duration-300"
          >
            <span className="text-lg">Filter</span>
            <HiFilter className="text-lg" />
          </button> */}
  
          {/* Filter Section */}
          {isFilterOpen && (
            <div className="bg-gray-800 text-white p-6 rounded-lg mb-4">
              <h2 className="font-semibold mb-4">Filters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Observed By */}
                <input
                  type="text"
                  placeholder="Observed By"
                  name="observedBy"
                  value={filters.observedBy}
                  onChange={handleFilterChange}
                  className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
                />
  
                {/* Supervisor */}
                <input
                  type="text"
                  placeholder="Supervisor"
                  name="supervisor"
                  value={filters.supervisor}
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
  
                {/* Description */}
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={filters.description}
                  onChange={handleFilterChange}
                  className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
                />
              </div>
              <button
                onClick={applyFilters}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Apply Filters
              </button>
            </div>
          )}
  
          {/* Add Security Report Button */}
          <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/security-services/security-reports/add">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
                  Add Security Report
              </button>
          </Link>
          
  
<button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Export Options
          </button>
                </div>
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
        </Layout>);
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Security Reports</h1>

        {/* Filter Button */}
        <button
          onClick={toggleFilter}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-900 transition-all duration-300"
        >
          <span className="text-lg">Filter</span>
          <HiFilter className="text-lg" />
        </button>

        {/* Filter Section */}
        {isFilterOpen && (
          <div className="bg-gray-800 text-white p-6 rounded-lg mb-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Observed By */}
              <input
                type="text"
                placeholder="Observed By"
                name="observedBy"
                value={filters.observedBy}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

              {/* Supervisor */}
              <input
                type="text"
                placeholder="Supervisor"
                name="supervisor"
                value={filters.supervisor}
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

              {/* Description */}
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={filters.description}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />
            </div>
            <button
              onClick={applyFilters}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Add Security Report Button */}
        <div >
        <Link href="/security-services/security-reports/add">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
                Add Security Report
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
        {/* Reports Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{item.description}</h2>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-1"><strong>Observed By:</strong> {item.observedByName}</p>
              <p className="text-gray-600 mb-1"><strong>Supervised:</strong> {item.supervisorName}</p>
              <p className="text-gray-600 mb-1"><strong>Action:</strong> {item.action}</p>
              

              {/* Actions */}
              <div className="flex space-x-4 mt-4">
                <Link href={`/security-services/security-reports/view/${item.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-1" /> View
                  </div>
                </Link>
                <Link href={`/security-services/security-reports/edit/${item.id}`}>
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


// Server-side function to fetch data for the first page
export async function getServerSideProps() {
  try {
    // Fetch data from your API endpoint
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/security-reports`);
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Failed to fetch data from the API');
    }

    const data = await response.json();

    // Log the raw data for debugging purposes
    console.log('Fetched Data:', data);

    // Ensure the data is an array
    if (!Array.isArray(data)) {
      throw new Error('The data returned from the API is not an array');
    }

    // Convert Date objects to strings for serialization
    const serializedData = data.map((report) => ({
      ...report,
      createdAt: report.createdAt ? new Date(report.createdAt).toISOString() : null,
      updatedAt: report.updatedAt ? new Date(report.updatedAt).toISOString() : null,
      date: report.date ? new Date(report.date).toISOString() : null,
    }));

    // Return the serialized data
    return {
      props: {
        initialData: serializedData,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    // If an error occurs, return an empty array or handle it as needed
    return {
      props: {
        initialData: [],
      },
    };
  }
}

  
