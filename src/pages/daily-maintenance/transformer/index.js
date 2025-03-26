import { useState } from "react";
import Link from "next/link";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Layout from "../../../components/layout";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function TransformersPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);

  const [filters, setFilters] = useState({
    transformerNo: "",
    date: "",
    lastMaintenance: "",
    nextMaintenance: "",
    temp: "",
    voltage: "",
  });

  // Delete transformer logic
  const deleteTransformer = async (id) => {
    try {
      const response = await fetch(`/api/transformer/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transformer');
      }

      // Remove the transformer from the state
      setData((prevData) => prevData.filter((transformer) => transformer.id !== id));

      alert('Transformer deleted successfully');
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the transformer');
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ page, ...filters }).toString();
    const res = await fetch(`/api/transformer?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData(newData);
    setHasMore(nextPage);
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1, ...filters }).toString();
    const res = await fetch(`/api/transformer?${query}`);
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
    const res = await fetch(`/api/monthexport/transformer?from=${from}&to=${to}`);
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
      TransformerNo: report.transformerNo,
      LastMaintenance: report.lastMaintenance ? new Date(report.lastMaintenance).toLocaleDateString() : 'N/A',
      NextMaintenance: new Date(report.nextMaintenance).toLocaleDateString(),
      LastDehydration: report.lastDehydration ? new Date(report.lastDehydration).toLocaleDateString() : 'N/A',
      NextDehydration: new Date(report.nextDehydration).toLocaleDateString(),
      Engineer: report.engineer,
      Temp: report.temp,
      TempStatus: report.tempStatus,
      HTvoltage: report.HTvoltage,
      HTStatus: report.HTStatus,
      LTvoltage: report.LTvoltage,
      LTStatus: report.LTStatus,
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
      { wpx: 150 }, // TransformerNo
      { wpx: 150 }, // LastMaintenance
      { wpx: 150 }, // NextMaintenance
      { wpx: 150 }, // LastDehydration
      { wpx: 150 }, // NextDehydration
      { wpx: 150 }, // Engineer
      { wpx: 100 }, // Temp
      { wpx: 100 }, // TempStatus
      { wpx: 100 }, // Voltage
      { wpx: 100 }, // VoltageStatus
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Transformer Reports');
    XLSX.writeFile(wb, 'transformer-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Transformer Reports', 14, 10);
  
    // Add headers for the transformer data
    const headers = [
      'ID', 'Date', 'Transformer No.', 'Last Maintenance', 'Next Maintenance', 'Last Dehydration', 
      'Next Dehydration', 'Engineer', 'Temp', 'Temp Status', 'Voltage', 'Voltage Status'
    ];
  
    // Create the table data for each report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      report.transformerNo,
      report.lastMaintenance ? new Date(report.lastMaintenance).toLocaleDateString() : 'N/A',
      new Date(report.nextMaintenance).toLocaleDateString(),
      report.lastDehydration ? new Date(report.lastDehydration).toLocaleDateString() : 'N/A',
      new Date(report.nextDehydration).toLocaleDateString(),
      report.engineer,
      report.temp,
      report.tempStatus,
      report.HTvoltage,
      report.HTStatus,
      report.LTvoltage,
      report.LTStatus,
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('transformer-reports.pdf');
  };
  
  return (
    <Layout >
      <div className="max-w-7xl mx-auto p-6 min-h-screen rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-slate mb-8">Transformer Reports</h1>
        {/* Add Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/daily-maintenance/transformer/add">
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
        {/* <div className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              name="transformerNo"
              value={filters.transformerNo}
              onChange={handleFilterChange}
              placeholder="Transformer No"
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
              type="date"
              name="lastMaintenance"
              value={filters.lastMaintenance}
              onChange={handleFilterChange}
              placeholder="Last Maintenance"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              name="nextMaintenance"
              value={filters.nextMaintenance}
              onChange={handleFilterChange}
              placeholder="Next Maintenance"
              className="px-4 py-2 border rounded-md"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div> */}

        {/* Transformers Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((transformer) => (
            <div key={transformer.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{transformer.transformerNo}</h2>
              <p><strong>Date:</strong> {new Date(transformer.date).toLocaleDateString()}</p>
              <p><strong>Last Maintenance:</strong> {transformer.lastMaintenance ? new Date(transformer.lastMaintenance).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Next Maintenance:</strong> {transformer.nextMaintenance ? new Date(transformer.nextMaintenance).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Temperature:</strong> {transformer.temp ? transformer.temp : 'N/A'}</p>
              <p><strong>HT.Voltage:</strong> {transformer.HTvoltage ? transformer.HTvoltage : 'N/A'}</p>              
              <p><strong>LT.Voltage:</strong> {transformer.LTvoltage ? transformer.LTvoltage : 'N/A'}</p>

              <div className="flex space-x-6 mt-4">
                <Link href={`/daily-maintenance/transformer/view/${transformer.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/transformer/edit/${transformer.id}`}>
                  <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
                    <HiOutlinePencil className="mr-2" /> Edit
                  </div>
                </Link>
                <div className="text-red-600 hover:text-red-800 flex items-center cursor-pointer"
                    onClick={() => deleteTransformer(transformer.id)}

                >
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
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/transformer?${new URLSearchParams(query).toString()}`);
    
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    const { data: transformers, nextPage } = data;

    return {
      props: {
        initialData: transformers,
        nextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching Transformers data in getServerSideProps:", error);
    
    return {
      props: {
        initialData: [],
        nextPage: null,
      },
    };
  }
}
