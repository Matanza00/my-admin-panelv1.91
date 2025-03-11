// src/pages/security-services/cctv-report/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/layout';
import { HiEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function CCTVPage() {
  const [cctvRecords, setCctvRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch CCTV records from API with pagination
  useEffect(() => {
    const fetchCctvRecords = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cctv-report?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch CCTV records');

        const { data, nextPage } = await response.json();
        setCctvRecords((prevRecords) => [...prevRecords, ...data]);
        setHasMore(nextPage);
      } catch (error) {
        console.error('Failed to fetch CCTV records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCctvRecords();
  }, [page]);

  // Load more records on button click
  const loadMore = () => {
    if (!loading && hasMore) setPage((prevPage) => prevPage + 1);
  };

  // Delete handler function
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`/api/cctv-report/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Successfully deleted, remove the deleted record from the list
          setCctvRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
          alert('Record deleted successfully!');
        } else {
          console.error('Failed to delete record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };
  // const formatDate = (date) => {
  //   return new Date(date).toLocaleDateString();
  // };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
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
  
    // Fetch data from the CCTV Reports endpoint
    const res = await fetch(`/api/monthexport/cctvreport?from=${from}&to=${to}`);
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
      Time: new Date(report.time).toLocaleTimeString(),
      Remarks: report.remarks,
      OperationalReport: report.operationalReport ? 'Yes' : 'No',
      CCTVOperator: report.cctvOperator,
      Cameras: report.camera.map(camera => `${camera.cameraName} (${camera.cameraNo} - ${camera.cameraLocation})`).join(", ")
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
      { wpx: 100 }, // Time
      { wpx: 200 }, // Remarks
      { wpx: 150 }, // Operational Report (Yes/No)
      { wpx: 150 }, // CCTV Operator
      { wpx: 250 }, // Cameras
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'CCTV Reports');
    XLSX.writeFile(wb, 'cctvreports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('CCTV Reports', 14, 10);
  
    // Add headers for the CCTV report data
    const headers = [
      'ID', 'Date', 'Time', 'Remarks', 'Operational Report', 'CCTV Operator', 'Cameras'
    ];
  
    // Create the table data for each CCTV report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      new Date(report.time).toLocaleTimeString(),
      report.remarks,
      report.operationalReport ? 'Yes' : 'No',
      report.cctvOperator,
      report.camera.map(camera => `${camera.cameraName} (${camera.cameraNo} - ${camera.cameraLocation})`).join(", ")
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('cctvreports.pdf');
  };
  
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">CCTV Report Records</h1>
<div className="flex justify-start items-center space-x-4 mb-6 mt-4">
        <Link href="/security-services/cctv-report/add">
          <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Add New Record
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cctvRecords.length > 0 ? (
            cctvRecords.map((record) => (
              <div key={record.id} className="p-4 border rounded shadow hover:shadow-md transition-shadow">
                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formatTime(record.time)}</p>
                <p><strong>Operator:</strong> {record.cctvOperatorName}</p>
                <p>
                  <strong>Operational Report:</strong>{' '}
                  {record.operationalReport ? 'Yes' : 'No'}
                </p>

                {/* Actions */}
                <div className="flex space-x-4 mt-4">
                  <Link href={`/security-services/cctv-report/view/${record.id}`}>
                    <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                      <HiEye className="mr-1" /> View
                    </div>
                  </Link>
                  <Link href={`/security-services/cctv-report/edit/${record.id}`}>
                    <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
                      <HiOutlinePencil className="mr-1" /> Edit
                    </div>
                  </Link>
                  <div
                    className="text-red-600 hover:text-red-800 flex items-center cursor-pointer"
                    onClick={() => handleDelete(record.id)}
                  >
                    <HiOutlineTrash className="mr-1" /> Delete
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No records found.</p>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <button
            onClick={loadMore}
            className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </Layout>
  );
}
