import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../../components/layout';
import { HiEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';

export default function DailyDutySecurityPage({ initialData, nextPage }) {
  const [records, setRecords] = useState(initialData || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage || false);
  const [loading, setLoading] = useState(false);

  const loadMoreRecords = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/security-services/daily-duty-security?page=${page + 1}`);
      if (!res.ok) {
        throw new Error('Failed to load more records');
      }
      const { data: newRecords, nextPage: hasNext } = await res.json();
      setRecords((prev) => [...prev, ...newRecords]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(hasNext);
    } catch (error) {
      console.error('Failed to fetch additional records:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
  
    try {
      const res = await fetch(`/api/daily-duty-security?id=${id}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        setRecords((prev) => prev.filter((record) => record.id !== id));
        alert('Record deleted successfully');
      } else {
        const errorData = await res.json();
        console.error('Failed to delete record:', errorData.error);
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('An error occurred while deleting the record');
    }
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
  
    // Fetch data from the Daily Duty Security endpoint
    const res = await fetch(`/api/monthexport/dailydutysecurity?from=${from}&to=${to}`);
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
    const rows = data.map((duty) => ({
      ID: duty.id,
      Date: new Date(duty.date).toLocaleDateString(),
      Shift: duty.shift,
      Supervisor: duty.supervisor,
      UserDetails: duty.usersec.length
        ? duty.usersec.map(user => `${user.name} (${user.designation})`).join(", ")
        : "No users assigned",
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
      { wpx: 120 }, // Shift
      { wpx: 150 }, // Supervisor
      { wpx: 200 }, // User Details (Assigned security)
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Duty Security');
    XLSX.writeFile(wb, 'dailydutysecurity.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Daily Duty Security', 14, 10);
  
    // Add headers for the duty data
    const headers = [
      'ID', 'Date', 'Shift', 'Supervisor', 'User Details'
    ];
  
    // Create the table data for each duty
    const tableData = data.map((duty) => [
      duty.id,
      new Date(duty.date).toLocaleDateString(),
      duty.shift,
      duty.supervisor,
      duty.usersec.length
        ? duty.usersec.map(user => `${user.name} (${user.designation})`).join(", ")
        : 'No users assigned',
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('dailydutysecurity.pdf');
  };
  
  return (
    <Layout>
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Daily Duty Security Records
          </h1>

          <div className="flex justify-end mb-4">
            <Link href="/security-services/daily-duty-security/add">
              <button className="px-4 py-2 bg-green-500 text-white text-sm sm:text-base font-medium rounded-md shadow hover:bg-green-600 transition">
                + Add New Record
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.length > 0 ? (
              records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Date:</span> {record.date}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Shift:</span> {record.shift}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Supervisor:</span> {record.supervisorName}
                    </p>
                  </div>

                  <h3 className="text-sm font-medium text-gray-800 mb-2">
                    Securities Attendance Timeline: ({record.usersec?.length || 0} person)
                  </h3>

                  <div className="flex justify-between items-center mt-4 gap-2">
                    <Link href={`/security-services/daily-duty-security/view/${record.id}`}>
                      <button className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
                        <HiEye className="inline-block mr-1" /> View
                      </button>
                    </Link>
                    <Link href={`/security-services/daily-duty-security/edit/${record.id}`}>
                      <button className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition">
                        <HiOutlinePencil className="inline-block mr-1" /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                    >
                      <HiOutlineTrash className="inline-block mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No records found.
              </p>
            )}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreRecords}
                className="px-5 py-2 text-sm bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Fetch data server-side
export async function getServerSideProps(context) {
  const { query } = context;
  const page = query.page || 1;

  try {
    const res = await fetch(
      `${process.env.BASE_URL || 'http://localhost:3000'}/api/daily-duty-security?page=${page}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch records: ${res.statusText}`);
    }

    const { data, nextPage } = await res.json();

    return {
      props: {
        initialData: data || [],
        nextPage: nextPage || false,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    return {
      props: {
        initialData: [],
        nextPage: false,
      },
    };
  }
}
