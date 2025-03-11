import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineX } from 'react-icons/hi';
import Layout from '../../../components/layout';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function FCUReportPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const [filters, setFilters] = useState({
    floorFrom: '',
    floorTo: '',
    attendedBy: '',
    supervisorApproval: '',
  });
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [exportFormat, setExportFormat] = useState('excel'); // Add state to store export format choice
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ page: 1, ...filters }).toString();
    const res = await fetch(`/api/fcu-reports?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData(newData);
    setPage(1);
    setHasMore(nextPage);
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1, ...filters }).toString();
    const res = await fetch(`/api/fcu-reports?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData((prevData) => [...prevData, ...newData]);
    setPage(page + 1);
    setHasMore(nextPage);
  };

  const handleExport = async () => {
    const { from, to } = dateRange;

    if (!from || !to) {
      alert('Please select both "From" and "To" dates.');
      return;
    }

    const res = await fetch(`/api/monthexport/fcu?from=${from}&to=${to}`);
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
    const rows = data.map((report) =>
      report.floorFCs.map((floorFC) => ({
        ID: report.id,
        Date: new Date(report.date).toLocaleDateString(),
        Remarks: report.remarks,
        SupervisorApproval: report.supervisorApproval ? 'Approved' : 'Pending',
        EngineerApproval: report.engineerApproval ? 'Approved' : 'Pending',
        FloorFrom: floorFC.floorFrom,
        FloorTo: floorFC.floorTo,
        Details: floorFC.details,
        VerifiedBy: floorFC.verifiedBy,
        AttendedBy: floorFC.attendedBy,
      }))
    ).flat();

    return rows;
  };

  const exportToExcel = (excelData) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FCU Reports');
    XLSX.writeFile(wb, 'fcu-reports.xlsx');
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape'); // Set the orientation to landscape

    // Set the title at the top of the page
    doc.text('FCU Reports', 14, 10);

    // Prepare table data including floorFC details
    const tableData = data.map((report) => 
      report.floorFCs.map((floorFC) => ([ 
        report.id,
        new Date(report.date).toLocaleDateString(),
        report.remarks,
        report.supervisorApproval ? 'Approved' : 'Pending',
        report.engineerApproval ? 'Approved' : 'Pending',
        floorFC.floorFrom,
        floorFC.floorTo,
        floorFC.details,
        floorFC.verifiedBy,
        floorFC.attendedBy
      ]))
    ).flat(); // Flatten the array to avoid nested arrays

    // Define the table headers
    const headers = [
      'ID', 'Date', 'Remarks', 'Supervisor Approval', 'Engineer Approval',
      'Floor From', 'Floor To', 'Details', 'Verified By', 'Attended By'
    ];

    // Define the starting position for the table on the page (from bottom to top)
    const startingPosition = doc.internal.pageSize.height - 50;

    // Generate the table with data, position it from the bottom up
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: startingPosition, // Position the table to start from the bottom
      theme: 'striped', // Optional: gives a striped background to the table for better readability
    });

    // Save the generated PDF
    doc.save('fcu-reports.pdf');
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">FCU Reports</h1>

        <div className="mb-6 flex space-x-4">
          <Link href="/daily-maintenance/fcu-report/add">
            <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
              Add New FCU Report
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









        <div className="flex mb-6 space-x-4">
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
          <input
            type="text"
            name="attendedBy"
            value={filters.attendedBy}
            onChange={handleFilterChange}
            placeholder="Attended By"
            className="px-4 py-2 border rounded-md"
          />
          <select
            name="supervisorApproval"
            value={filters.supervisorApproval}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Supervisor Approval</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
          <button onClick={applyFilters} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Apply Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((report) => (
            <div key={report.id} className="bg-white border rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold">{report.supervisorApproval ? 'Approved' : 'Pending'}</h2>
              <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
              <p><strong>Remarks:</strong> {report.remarks}</p>
              <div className="flex mt-4 space-x-4">
                <Link href={`/daily-maintenance/fcu-report/view/${report.id}`}>
                  <button className="text-green-600">View</button>
                </Link>
                <Link href={`/daily-maintenance/fcu-report/edit/${report.id}`}>
                  <button className="text-blue-600">Edit</button>
                </Link>
                <button className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button onClick={loadMoreData} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
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
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/fcu-reports?${new URLSearchParams(query).toString()}`);
    const { data: fcuReports, nextPage } = await res.json();
    return { props: { initialData: fcuReports, nextPage } };
  } catch (error) {
    console.error('Error:', error);
    return { props: { initialData: [], nextPage: null } };
  }
}
