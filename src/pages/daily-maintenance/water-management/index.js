import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function WaterManagementPage({ initialData, nextPage }) {
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

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ ...filters, page: 1 }).toString();
    const res = await fetch(`/api/water-management?${query}`);
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
    const res = await fetch(`/api/water-management?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData((prevData) => [...prevData, ...newData]);
    setPage(page + 1);
    setHasMore(nextPage);
  };

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
    const res = await fetch(`/api/monthexport/watermanagement?from=${from}&to=${to}`);
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
      return report.pumps.map((pump) => {
        return pump.checks.map((check) => ({
          ID: report.id,
          Title: report.title,
          Description: report.description,
          SupervisorName: report.supervisorName,
          OperatorName: report.operatorName,
          CreatedAt: new Date(report.createdAt).toLocaleDateString(),
          UpdatedAt: new Date(report.updatedAt).toLocaleDateString(),
          PumpName: pump.name,
          PumpCapacity: pump.capacity,
          Location: pump.location,
          WaterSealStatus: check.waterSealStatus,
          PumpBearingStatus: check.pumpBearingStatus,
          MotorBearingStatus: check.motorBearingStatus,
          RubberCouplingStatus: check.rubberCouplingStatus,
          PumpImpellerStatus: check.pumpImpellerStatus,
          MainValvesStatus: check.mainValvesStatus,
          MotorWindingStatus: check.motorWindingStatus,
        }));
      }).flat(); // Flatten the pump array for each report
    }).flat();
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 50 },  // ID
      { wpx: 150 }, // Title
      { wpx: 200 }, // Description
      { wpx: 150 }, // Supervisor Name
      { wpx: 150 }, // Operator Name
      { wpx: 100 }, // Created At
      { wpx: 100 }, // Updated At
      { wpx: 150 }, // Pump Name
      { wpx: 100 }, // Pump Capacity
      { wpx: 200 }, // Location
      { wpx: 150 }, // Water Seal Status
      { wpx: 150 }, // Pump Bearing Status
      { wpx: 150 }, // Motor Bearing Status
      { wpx: 150 }, // Rubber Coupling Status
      { wpx: 150 }, // Pump Impeller Status
      { wpx: 150 }, // Main Valves Status
      { wpx: 150 }, // Motor Winding Status
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Water Management Reports');
    XLSX.writeFile(wb, 'water-management-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Water Management Reports', 14, 10);
  
    // Add new headers for the additional data
    const headers = [
      'ID', 'Title', 'Description', 'Supervisor Name', 'Operator Name', 'Created At', 'Updated At', 
      'Pump Name', 'Pump Capacity', 'Location', 'Water Seal Status', 'Pump Bearing Status', 
      'Motor Bearing Status', 'Rubber Coupling Status', 'Pump Impeller Status', 'Main Valves Status', 
      'Motor Winding Status'
    ];
  
    // Create the table data with additional fields
    const tableData = data.map((report) => {
      return report.pumps.map((pump) => {
        return pump.checks.map((check) => [
          report.id,
          report.title,
          report.description,
          report.supervisorName,
          report.operatorName,
          new Date(report.createdAt).toLocaleDateString(),
          new Date(report.updatedAt).toLocaleDateString(),
          pump.name,
          pump.capacity,
          pump.location,
          check.waterSealStatus,
          check.pumpBearingStatus,
          check.motorBearingStatus,
          check.rubberCouplingStatus,
          check.pumpImpellerStatus,
          check.mainValvesStatus,
          check.motorWindingStatus,
        ]);
      }).flat(); // Flatten the pump array for each report
    }).flat();
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('water-management-reports.pdf');
  };
  
    const [exportFormat, setExportFormat] = useState('excel'); // Add state for export format

  return (
    <Layout backgroundColor="bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen rounded-lg">
        <h1 className="text-4xl font-semibold mb-8 text-white">Water Management</h1>

        {/* Filter Button */}
        {/* <button
          onClick={toggleFilter}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg flex justify-between items-center hover:bg-blue-700 transition duration-300 mb-6"
        >
          <span className="text-lg">Filters</span>
          <HiFilter className="text-lg" />
        </button> */}

        {/* Filter Section */}
        {isFilterOpen && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="font-semibold text-xl text-white mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder="Supervisor"
                name="supervisor"
                value={filters.supervisor}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Min Strength"
                name="strengthMin"
                value={filters.strengthMin}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Strength"
                name="strengthMax"
                value={filters.strengthMax}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={applyFilters}
              className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Add Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link
            href="/daily-maintenance/water-management/add"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300"
          >
            + Add New Entry
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
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
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
        {/* Water Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">{entry.title}</h2>
              <p className="text-gray-300 mb-2"><strong>Supervisor:</strong> {entry.supervisorName}</p>
              <p className="text-gray-400 mb-2"><strong>Created At:</strong> {new Date(entry.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-400 mb-2"><strong>Pumps Count:</strong> {entry.pumps.length}</p>
              <div className="flex space-x-6 mt-4">
                <Link href={`/daily-maintenance/water-management/view/${entry.id}`}>
                  <div className="text-green-500 hover:text-green-700 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/water-management/edit/${entry.id}`}>
                  <div className="text-blue-500 hover:text-blue-700 flex items-center cursor-pointer">
                    <HiOutlinePencil className="mr-2" /> Edit
                  </div>
                </Link>
                <div className="text-red-500 hover:text-red-700 flex items-center cursor-pointer">
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
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
    const res = await fetch(
      `${process.env.BASE_URL || 'http://localhost:3000'}/api/water-management?${new URLSearchParams(query).toString()}`
    );
    const { data, nextPage } = await res.json();

    // Ensure all Date fields are serialized to ISO strings
    const serializedData = data.map((item) => ({
      ...item,
      date: item.date ? new Date(item.date).toISOString() : null, // Convert date to ISO string if it exists
    }));

    return {
      props: {
        initialData: serializedData || [], // Pass serialized data
        nextPage: nextPage || null,       // Ensure nextPage fallback to null
      },
    };
  } catch (error) {
    console.error('Error fetching water management data:', error);
    return {
      props: {
        initialData: [], // Fallback to empty array on error
        nextPage: null,   // No next page if there was an error
      },
    };
  }
}

