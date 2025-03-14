import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';
// import { useSession } from 'next-auth/react';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function DutyChartPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    supervisor: '',
    remarks: '',
    attendanceCountMin: '',
    attendanceCountMax: '',
  });
  // const { data: session } = useSession();

  // Check if the user has permission
  // const hasDutyChartPermission = session?.user?.permissions.includes('manageDutyChart');
  // if (!hasDutyChartPermission) {
  //   return <p>You do not have permission to manage Duty Chart.</p>;
  // }

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
    const query = new URLSearchParams({ ...filters, page: 1 }).toString();
    const res = await fetch(`/api/dutychart?${query}`);
    const { data: filteredData, nextPage } = await res.json();
    setData(filteredData);


    setPage(1);
    setHasMore(nextPage);
  };

  // Load more data for pagination
  const loadMoreData = async () => {
    const query = new URLSearchParams({ ...filters, page: page + 1 }).toString();
    const res = await fetch(`/api/dutychart?${query}`);
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

  // Fetch data from the Duty Chart endpoint
  const res = await fetch(`/api/monthexport/dutychart?from=${from}&to=${to}`);
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
  const rows = data.map((chart) => {
    const attendanceDetails = chart.attendance.map((attendance) => ({
      Name: attendance.name,
      Designation: attendance.designation || 'N/A',
      TimeIn: attendance.timeIn
        ? new Date(attendance.timeIn).toLocaleTimeString()
        : 'N/A',
      TimeOut: attendance.timeOut
        ? new Date(attendance.timeOut).toLocaleTimeString()
        : 'N/A',
      LunchIn: attendance.lunchIn
        ? new Date(attendance.lunchIn).toLocaleTimeString()
        : 'N/A',
      LunchOut: attendance.lunchOut
        ? new Date(attendance.lunchOut).toLocaleTimeString()
        : 'N/A',
    }));

    return {
      ID: chart.id,
      Date: new Date(chart.date).toLocaleDateString(),
      Supervisor: chart.supervisor,
      Remarks: chart.remarks,
      Attendance: attendanceDetails
        .map(
          (att) =>
            `Name: ${att.Name}, Designation: ${att.Designation}, TimeIn: ${att.TimeIn}, TimeOut: ${att.TimeOut}, LunchIn: ${att.LunchIn}, LunchOut: ${att.LunchOut}`
        )
        .join('; '),
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
    { wpx: 200 }, // Remarks
    { wpx: 400 }, // Attendance
  ];

  // Set the column widths to the worksheet
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Duty Charts');
  XLSX.writeFile(wb, 'dutycharts.xlsx');
};

const exportToPDF = (data) => {
  const doc = new jsPDF('landscape');

  doc.text('Duty Charts', 14, 10);

  // Add headers for the Duty Chart data
  const headers = [
    'ID', 'Date', 'Supervisor', 'Remarks',  'Attendance'
  ];

  // Create the table data for each duty chart
  const tableData = data.map((chart) => [
    chart.id,
    new Date(chart.date).toLocaleDateString(),
    chart.supervisor,
    chart.remarks,
    chart.attendance
      .map(
        (att) =>
          `Name: ${att.name}, Designation: ${
            att.designation || 'N/A'
          }, TimeIn: ${
            att.timeIn ? new Date(att.timeIn).toLocaleTimeString() : 'N/A'
          }, TimeOut: ${
            att.timeOut ? new Date(att.timeOut).toLocaleTimeString() : 'N/A'
          }, LunchIn: ${
            att.lunchIn ? new Date(att.lunchIn).toLocaleTimeString() : 'N/A'
          }, LunchOut: ${
            att.lunchOut ? new Date(att.lunchOut).toLocaleTimeString() : 'N/A'
          }`
      )
      .join('; '),
  ]);

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 20,
    theme: 'striped',
  });

  doc.save('dutycharts.pdf');
};




  if (!data || data.length === 0) {
    return <Layout>     <div className="p-4">
    <h1 className="text-2xl font-semibold mb-6">Duty Chart</h1>

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

          {/* Supervisor */}
          <input
            type="text"
            placeholder="Supervisor"
            name="supervisor"
            value={filters.supervisor}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* Remarks */}
          <input
            type="text"
            placeholder="Remarks"
            name="remarks"
            value={filters.remarks}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />

          {/* Attendance Count Range */}
          <input
            type="number"
            placeholder="Min Attendance Count"
            name="attendanceCountMin"
            value={filters.attendanceCountMin}
            onChange={handleFilterChange}
            className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
          />
          <input
            type="number"
            placeholder="Max Attendance Count"
            name="attendanceCountMax"
            value={filters.attendanceCountMax}
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
    {/* Add More Complain Button */}
    <div className="mb-6 mt-4">
      <Link href="/general-administration/duty-chart/add">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
          Add More Complaint
        </button>
      </Link>
    </div>
<div className="p-4">No data available</div></div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Duty Chart</h1>

        {/* Full-width Filter Button */}
        {/* <button
          onClick={toggleFilter}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-900 transition-all duration-300"
        >
          <span className="text-lg">Filter</span>
          <HiFilter className="text-lg" />
        </button> */}

        {/* Collapsible Filter Section */}
        {isFilterOpen && (
          <div className="bg-gray-800 text-white p-6 rounded-lg mb-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

              {/* Supervisor */}
              <input
                type="text"
                placeholder="Supervisor"
                name="supervisor"
                value={filters.supervisor}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

              {/* Remarks */}
              <input
                type="text"
                placeholder="Remarks"
                name="remarks"
                value={filters.remarks}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />

              {/* Attendance Count Range */}
              <input
                type="number"
                placeholder="Min Attendance Count"
                name="attendanceCountMin"
                value={filters.attendanceCountMin}
                onChange={handleFilterChange}
                className="border border-gray-600 bg-gray-700 rounded-lg p-2 text-white"
              />
              <input
                type="number"
                placeholder="Max Attendance Count"
                name="attendanceCountMax"
                value={filters.attendanceCountMax}
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
        {/* Add More Complain Button */}
        <div className="mb-6 mt-4">
          <Link href="/general-administration/duty-chart/add">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300">
              Add More Complaint
            </button>
          </Link>
 

        <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 ml-4"
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

        {/* Duty Charts Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{item.supervisorName}</h2>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-1"><strong>Remarks:</strong> {item.remarks}</p>
              <p className="text-gray-600 mb-1"><strong>Total Attendance:</strong> {item.attendanceCount}</p>

              {/* Actions */}
              <div className="flex space-x-4 mt-4">
                <Link href={`/general-administration/duty-chart/view/${item.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-1" /> View
                  </div>
                </Link>
                <Link href={`/general-administration/duty-chart/edit/${item.id}`}>
                  <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
                    <HiOutlinePencil className="mr-1" /> Edit
                  </div>
                </Link>
                <div className="text-red-600 hover:text-red-800 flex items-center cursor-pointer">
                  <HiOutlineTrash className="mr-1" /> Delete
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreData}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/dutychart?${new URLSearchParams(query).toString()}`);
    const { data, nextPage } = await res.json();
    console.log(data)
    // Ensure data is an array and nextPage is a boolean
    return {
      props: {
        initialData: data || [],  // Default to an empty array if data is undefined
        nextPage: nextPage || false,  // Default to false if nextPage is undefined
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialData: [],  // Default to an empty array in case of error
        nextPage: false,   // Default to false in case of error
      },
    };
  }
}
