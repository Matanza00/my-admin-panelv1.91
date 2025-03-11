import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';

// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function JanitorialAttendancePage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    supervisor: '',
    strengthMin: '',
    strengthMax: '',
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
    const res = await fetch(`/api/janitorial-attendance?${query}`);
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
    const res = await fetch(`/api/janitorial-attendance?${query}`);
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

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Janitorial Attendance</h1>

        {/* Filter Button */}
        <button
          onClick={toggleFilter}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg flex justify-between items-center hover:bg-indigo-700 transition duration-300 mb-6"
        >
          <span className="text-lg">Filters</span>
          <HiFilter className="text-lg" />
        </button>

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
                type="number"
                placeholder="Min Presence Strength"
                name="strengthMin"
                value={filters.strengthMin}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Max Presence Strength"
                name="strengthMax"
                value={filters.strengthMax}
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

        {/* Add Janitorial Attendance Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link
            href="/janitorial/attendance/add"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300"
          >
            + Add New Janitorial Attendance
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

        {/* Janitorial Attendance Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((attendance) => (
            <div
              key={attendance.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {attendance.supervisorName || 'Unknown Supervisor'}
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>Total Janitors:</strong> {attendance.totalJanitors}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Present Strength:</strong> {attendance.strength}
              </p>
              <div className="flex space-x-6 mt-4">
                <Link href={`/janitorial/attendance/view/${attendance.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/janitorial/attendance/edit/${attendance.id}`}>
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
  const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}`;
  const url = `${baseUrl}/api/janitorial-attendance?${new URLSearchParams(query).toString()}`;

  try {
    console.log("Fetching Data From:", url); // Debugging the URL
    const res = await fetch(url);
    const json = await res.json();

    console.log("Response from API:", json); // Debugging the response
    
console.log('API Response:', json); // Check the full API response
    const { data, nextPage } = json;

    return {
      props: {
        initialData: data || [],
        nextPage: nextPage || false,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error.message);
    return {
      props: {
        initialData: [],
        nextPage: false,
      },
    };
  }
}

