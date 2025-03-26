import { useState } from "react";
import Link from "next/link";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Layout from "../../../components/layout";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function PlumbingProjectsPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);

  const [filters, setFilters] = useState({
    plumberName: "",
    location: "",
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
    const res = await fetch(`/api/plumbingproject?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData(newData);
    setHasMore(nextPage);
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1, ...filters }).toString();
    const res = await fetch(`/api/plumbingproject?${query}`);
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
    const res = await fetch(`/api/monthexport/plumbing?from=${from}&to=${to}`);
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
      return report.locations.map((location) => {
        return location.rooms.map((room) => ({
          ID: report.id,
          Date: new Date(report.date).toLocaleDateString(),
          PlumberName: report.plumberName,
          SupervisorName: report.supervisorName,
          LocationName: location.locationName,
          LocationFloor: location.locationFloor,
          RoomName: room.roomName,
          WashBasin: room.plumbingCheck.washBasin ? 'Yes' : 'No',
          Shower: room.plumbingCheck.shower ? 'Yes' : 'No',
          WaterTaps: room.plumbingCheck.waterTaps ? 'Yes' : 'No',
          Commode: room.plumbingCheck.commode ? 'Yes' : 'No',
          IndianWC: room.plumbingCheck.indianWC ? 'Yes' : 'No',
          EnglishWC: room.plumbingCheck.englishWC ? 'Yes' : 'No',
          WaterFlushKit: room.plumbingCheck.waterFlushKit ? 'Yes' : 'No',
          WaterDrain: room.plumbingCheck.waterDrain ? 'Yes' : 'No',
        }));
      }).flat(); // Flatten the array to avoid nested array structure
    }).flat();
  
    return rows;
  };
  
  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
  
    // Set custom column widths (in characters)
    const colWidths = [
      { wpx: 80 },  // ID
      { wpx: 100 }, // Date
      { wpx: 150 }, // Plumber Name
      { wpx: 150 }, // Supervisor Name
      { wpx: 200 }, // Location Name
      { wpx: 100 }, // Location Floor
      { wpx: 150 }, // Room Name
      { wpx: 80 },  // Wash Basin
      { wpx: 80 },  // Shower
      { wpx: 80 },  // Water Taps
      { wpx: 80 },  // Commode
      { wpx: 80 },  // Indian WC
      { wpx: 80 },  // English WC
      { wpx: 100 }, // Water Flush Kit
      { wpx: 80 },  // Water Drain
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Plumbing Reports');
    XLSX.writeFile(wb, 'plumbing-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Plumbing Reports', 14, 10);
  
    // Add new headers for the additional data
    const headers = [
      'ID', 'Date', 'Plumber Name', 'Supervisor Name', 'Location Name', 'Location Floor', 'Room Name',
      'Wash Basin', 'Shower', 'Water Taps', 'Commode', 'Indian WC', 'English WC', 'Water Flush Kit', 'Water Drain'
    ];
  
    // Create the table data with additional fields
    const tableData = data.map((report) => {
      return report.locations.map((location) => {
        return location.rooms.map((room) => [
          report.id,
          new Date(report.date).toLocaleDateString(),
          report.plumberName,
          report.supervisorName,
          location.locationName,
          location.locationFloor,
          room.roomName,
          room.plumbingCheck.washBasin ? 'Yes' : 'No',
          room.plumbingCheck.shower ? 'Yes' : 'No',
          room.plumbingCheck.waterTaps ? 'Yes' : 'No',
          room.plumbingCheck.commode ? 'Yes' : 'No',
          room.plumbingCheck.indianWC ? 'Yes' : 'No',
          room.plumbingCheck.englishWC ? 'Yes' : 'No',
          room.plumbingCheck.waterFlushKit ? 'Yes' : 'No',
          room.plumbingCheck.waterDrain ? 'Yes' : 'No',
        ]);
      }).flat(); // Flatten the array to avoid nested table rows
    }).flat();
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('plumbing-reports.pdf');
  };
  
    const [exportFormat, setExportFormat] = useState('excel'); // Add state for export format

  return (
    <Layout  backgroundColor="bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-8">Plumbing Reports</h1>

        {/* Add Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/daily-maintenance/plumbing/add">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow">
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
        {/* <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl text-white font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="plumberName"
              value={filters.plumberName}
              onChange={handleFilterChange}
              placeholder="Plumber Name"
              className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500"
            />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow"
            >
              Apply Filters
            </button>
          </div>
        </div> */}

        {/* Plumbing Projects Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-400">{project.location}</h2>
              <p className="mb-1">
                <strong>Date:</strong> {new Date(project.date).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <strong>Plumber:</strong> {project.plumberName}
              </p>
              {project.locations.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-bold text-lg">Locations:</h4>
                  {project.locations.map((location, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      <p>
                        <strong>Floor:</strong> {location.locationFloor}
                      </p>
                      <p>
                        <strong>Name:</strong> {location.locationName || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Link href={`/daily-maintenance/plumbing/view/${project.id}`}>
                  <div className="flex items-center text-green-400 hover:text-green-600 cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/plumbing/edit/${project.id}`}>
                  <div className="flex items-center text-blue-400 hover:text-blue-600 cursor-pointer">
                    <HiOutlinePencil className="mr-2" /> Edit
                  </div>
                </Link>
                <div className="flex items-center text-red-400 hover:text-red-600 cursor-pointer">
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
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 shadow"
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
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/plumbingproject?${new URLSearchParams(query).toString()}`);
    
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    const { data: projects, nextPage } = data;

    return {
      props: {
        initialData: projects,
        nextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching Plumbing Projects data in getServerSideProps:", error);
    
    return {
      props: {
        initialData: [],
        nextPage: null,
      },
    };
  }
}
