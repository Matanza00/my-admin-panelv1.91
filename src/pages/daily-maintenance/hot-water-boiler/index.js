import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Layout from '../../../components/layout';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function HotWaterBoilerPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);

  const [filters, setFilters] = useState({
    operatorName: '',
    supervisorName: '',
    floorFrom: '',
    floorTo: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ page, ...filters }).toString();
    const res = await fetch(`/api/hot-water-boiler?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData(newData);
    setHasMore(nextPage);
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1, ...filters }).toString();
    const res = await fetch(`/api/hot-water-boiler?${query}`);
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
    const res = await fetch(`/api/monthexport/hotwaterboiler?from=${from}&to=${to}`);
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
      return report.TimeHr.map((timeEntry) => ({
        ID: report.id,
        Date: new Date(report.Date).toLocaleDateString(),
        StartTime: new Date(report.StartTime).toLocaleString(),
        ShutdownTime: new Date(report.ShutdownTime).toLocaleString(),
        OperatorName: report.OperatorName,
        SupervisorName: report.SupervisorName,
        Remarks: report.Remarks,
        HotWaterIn: timeEntry.HotWaterIn,
        HotWaterOut: timeEntry.HotWaterOut,
        ExhaustTemp: timeEntry.ExhaustTemp,
        FurnacePressure: timeEntry.FurnacePressure,
        AssistantSupervisor: timeEntry.assistantSupervisor,
      }));
    }).flat(); // Flatten the array to avoid nested array structure
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 80 },  // ID
      { wpx: 100 }, // Date
      { wpx: 120 }, // Start Time
      { wpx: 120 }, // Shutdown Time
      { wpx: 150 }, // Operator Name
      { wpx: 150 }, // Supervisor Name
      { wpx: 200 }, // Remarks
      { wpx: 100 }, // Hot Water In
      { wpx: 100 }, // Hot Water Out
      { wpx: 100 }, // Exhaust Temp
      { wpx: 100 }, // Furnace Pressure
      { wpx: 150 }, // Assistant Supervisor
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Hot Water Boiler Reports');
    XLSX.writeFile(wb, 'hot-water-boiler-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Hot Water Boiler Reports', 14, 10);
  
    // Add new headers for the additional data
    const headers = [
      'ID', 'Date', 'Start Time', 'Shutdown Time', 'Operator Name', 'Supervisor Name', 'Remarks',
      'Hot Water In', 'Hot Water Out', 'Exhaust Temp', 'Furnace Pressure', 'Assistant Supervisor'
    ];
  
    // Create the table data with additional fields
    const tableData = data.map((report) => {
      return report.TimeHr.map((timeEntry) => [
        report.id,
        new Date(report.Date).toLocaleDateString(),
        new Date(report.StartTime).toLocaleString(),
        new Date(report.ShutdownTime).toLocaleString(),
        report.OperatorName,
        report.SupervisorName,
        report.Remarks,
        timeEntry.HotWaterIn,
        timeEntry.HotWaterOut,
        timeEntry.ExhaustTemp,
        timeEntry.FurnacePressure,
        timeEntry.assistantSupervisor,
      ]);
    }).flat(); // Flatten the array to avoid nested table rows
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('hot-water-boiler-reports.pdf');
  };
  
    const [exportFormat, setExportFormat] = useState('excel'); // Add state for export format

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Hot Water Boiler Reports</h1>
        {/* Add New  Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/daily-maintenance/hot-water-boiler/add">
            <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300">
              Add New Report
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


        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              name="operatorName"
              value={filters.operatorName}
              onChange={handleFilterChange}
              placeholder="Operator Name"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="supervisorName"
              value={filters.supervisorName}
              onChange={handleFilterChange}
              placeholder="Supervisor Name"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="floorFrom"
              value={filters.floorFrom}
              onChange={handleFilterChange}
              placeholder="Floor From"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="floorTo"
              value={filters.floorTo}
              onChange={handleFilterChange}
              placeholder="Floor To"
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

        {/* Hot Water Boiler Reports Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((boiler) => (
            <div key={boiler.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{boiler.EngineerName}</h2>
              <p><strong>Start Time:</strong> {new Date(boiler.StartTime).toLocaleString()}</p>
              <p><strong>Shutdown Time:</strong> {new Date(boiler.ShutdownTime).toLocaleString()}</p>
              <p><strong>Operator:</strong> {boiler.OperatorName}</p>
              <p><strong>Remarks:</strong> {boiler.Remarks}</p>
              <div className="flex space-x-6 mt-4">
                <Link href={`/daily-maintenance/hot-water-boiler/view/${boiler.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/hot-water-boiler/edit/${boiler.id}`}>
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
  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/hot-water-boiler?${new URLSearchParams(query).toString()}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    const { data: boilers, nextPage } = data;

    return {
      props: {
        initialData: boilers,
        nextPage,
      },
    };
  } catch (error) {
    console.error('Error fetching Hot Water Boiler data in getServerSideProps:', error);
    
    return {
      props: {
        initialData: [],
        nextPage: null,
      },
    };
  }
}
