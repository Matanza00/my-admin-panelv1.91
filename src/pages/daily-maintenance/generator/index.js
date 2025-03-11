import { useState } from "react";
import Link from "next/link";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Layout from "../../../components/layout";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function GeneratorPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);

  const [filters, setFilters] = useState({
    genSetNo: "",
    electricianName: "",
    supervisorName: "",
    engineerName: "",
    date: "",
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
    const res = await fetch(`/api/generator?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData(newData);
    setHasMore(nextPage);
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1, ...filters }).toString();
    const res = await fetch(`/api/generator?${query}`);
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
    const res = await fetch(`/api/monthexport/generator?from=${from}&to=${to}`);
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
      GenSetNo: report.genSetNo,
      Power: report.power,
      Capacity: report.capacity,
      EngOil: report.engOil ? 'Present' : 'Not Present',
      FuelFilter: report.fuelFilter ? 'OK' : 'Not OK',
      AirFilter: report.airFilter ? 'OK' : 'Not OK',
      CurrHrs: report.currHrs,
      CurrDate: new Date(report.currDate).toLocaleDateString(),
      LastHrs: report.lastHrs || 'N/A',
      LastDate: report.lastDate ? new Date(report.lastDate).toLocaleDateString() : 'N/A',
      ElectricianName: report.electricianName,
      SupervisorName: report.supervisorName || 'N/A',
      EngineerName: report.engineerName,
      FuelLast: report.generatorFuel[0]?.fuelLast || 'N/A',
      FuelConsumed: report.generatorFuel[0]?.fuelConsumed || 'N/A',
      FuelReceived: report.generatorFuel[0]?.fuelReceived || 'N/A',
      AvailableFuel: report.generatorFuel[0]?.available || 'N/A',
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
      { wpx: 120 }, // GenSetNo
      { wpx: 150 }, // Power
      { wpx: 100 }, // Capacity
      { wpx: 100 }, // EngOil
      { wpx: 100 }, // FuelFilter
      { wpx: 100 }, // AirFilter
      { wpx: 80 },  // CurrHrs
      { wpx: 100 }, // CurrDate
      { wpx: 80 },  // LastHrs
      { wpx: 100 }, // LastDate
      { wpx: 150 }, // ElectricianName
      { wpx: 150 }, // SupervisorName
      { wpx: 150 }, // EngineerName
      { wpx: 100 }, // FuelLast
      { wpx: 100 }, // FuelConsumed
      { wpx: 100 }, // FuelReceived
      { wpx: 100 }, // AvailableFuel
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Generator Reports');
    XLSX.writeFile(wb, 'generator-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Generator Reports', 14, 10);
  
    // Add headers for the generator data
    const headers = [
      'ID', 'Date', 'GenSet No.', 'Power', 'Capacity', 'EngOil', 'FuelFilter', 'AirFilter', 
      'CurrHrs', 'CurrDate', 'LastHrs', 'LastDate', 'Electrician Name', 'Supervisor Name', 
      'Engineer Name', 'FuelLast', 'FuelConsumed', 'FuelReceived', 'Available Fuel'
    ];
  
    // Create the table data for each report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      report.genSetNo,
      report.power,
      report.capacity,
      report.engOil ? 'Present' : 'Not Present',
      report.fuelFilter ? 'OK' : 'Not OK',
      report.airFilter ? 'OK' : 'Not OK',
      report.currHrs,
      new Date(report.currDate).toLocaleDateString(),
      report.lastHrs || 'N/A',
      report.lastDate ? new Date(report.lastDate).toLocaleDateString() : 'N/A',
      report.electricianName,
      report.supervisorName || 'N/A',
      report.engineerName,
      report.generatorFuel[0]?.fuelLast || 'N/A',
      report.generatorFuel[0]?.fuelConsumed || 'N/A',
      report.generatorFuel[0]?.fuelReceived || 'N/A',
      report.generatorFuel[0]?.available || 'N/A',
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('generator-reports.pdf');
  };
  
  return (
    <Layout  backgroundColor="bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Generators</h1>

        {/* Add Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/daily-maintenance/generator/add">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300">
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="text"
              name="genSetNo"
              value={filters.genSetNo}
              onChange={handleFilterChange}
              placeholder="Generator Set No."
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              name="electricianName"
              value={filters.electricianName}
              onChange={handleFilterChange}
              placeholder="Electrician Name"
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              name="supervisorName"
              value={filters.supervisorName}
              onChange={handleFilterChange}
              placeholder="Supervisor Name"
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              name="engineerName"
              value={filters.engineerName}
              onChange={handleFilterChange}
              placeholder="Engineer Name"
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-300"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Generators Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((generator) => (
            <div
              key={generator.id}
              className="bg-gray-700 p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">{generator.genSetNo}</h2>
              <p className="text-gray-300"><strong>Power:</strong> {generator.power}</p>
              <p className="text-gray-300"><strong>Current Date:</strong> {new Date(generator.currDate).toLocaleDateString()}</p>
              <p className="text-gray-300"><strong>Electrician:</strong> {generator.electricianName}</p>
              <p className="text-gray-300"><strong>Engineer:</strong> {generator.engineerName}</p>
              <div className="flex space-x-4 mt-4">
                <Link href={`/daily-maintenance/generator/view/${generator.id}`}>
                  <div className="text-green-500 hover:text-green-300 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/generator/edit/${generator.id}`}>
                  <div className="text-blue-500 hover:text-blue-300 flex items-center cursor-pointer">
                    <HiOutlinePencil className="mr-2" /> Edit
                  </div>
                </Link>
                <div className="text-red-500 hover:text-red-300 flex items-center cursor-pointer">
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
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300"
            >
              Load More
            </button>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-400">No more records to load.</div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/generator?${new URLSearchParams(query).toString()}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await res.json();
    const { data: generators, nextPage } = data;
    console.log(data)
    return {
      props: {
        initialData: generators,
        nextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching Generator data in getServerSideProps:", error);

    return {
      props: {
        initialData: [],
        nextPage: null,
      },
    };
  }
}
