import { useState } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineX } from 'react-icons/hi';
// import { FaFireExtinguisher } from 'react-icons/fa';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}


export default function FirefightingPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const router = useRouter();
  const { firefighterName = '', dateFrom = '', dateTo = '' } = router.query;

const [filters, setFilters] = useState({
  firefighterName,
  dateFrom,
  dateTo,
});

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    const query = { page: 1, ...filters };
    router.push({
      pathname: '/daily-maintenance/firefighting',
      query,
    });
  
    const queryString = new URLSearchParams(query).toString();
    const res = await fetch(`/api/firefighting?${queryString}`);
    const { data: newData, nextPage } = await res.json();
  
    setData(newData);
    setHasMore(nextPage);
  };
  

  const loadMoreData = async () => {
    const query = new URLSearchParams({ page: page + 1 }).toString();
    const res = await fetch(`/api/firefighting?${query}`);
    const { data: newData, nextPage } = await res.json();
  
    setData((prevData) => [...prevData, ...newData]); // Append new records
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
    const res = await fetch(`/api/monthexport/firefighting?from=${from}&to=${to}`);
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
      FirefighterName: report.firefighterName,
      AddressableSmokeStatus: report.addressableSmokeStatus ? 'Working' : 'Not Working',
      FireAlarmingSystemStatus: report.fireAlarmingSystemStatus ? 'Working' : 'Not Working',
      FireExtinguisherStatus: report.fireextinguisherStatus? 'Working' : 'Not Working',
      DieselEnginePumpStatus: report.dieselEnginePumpStatus ? 'Working' : 'Not Working',
      WetRisersStatus: report.wetRisersStatus ? 'Working' : 'Not Working',
      HoseReelCabinetsStatus: report.hoseReelCabinetsStatus ? 'Working' : 'Not Working',
      ExternalHydrantsStatus: report.externalHydrantsStatus ? 'Working' : 'Not Working',
      WaterStorageTanksStatus: report.waterStorageTanksStatus ? 'Working' : 'Not Working',
      EmergencyLightsStatus: report.emergencyLightsStatus ? 'Working' : 'Not Working',
      Remarks: report.remarks,
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
      { wpx: 150 }, // Firefighter Name
      { wpx: 150 }, // Addressable Smoke Status
      { wpx: 150 }, // Fire Alarming System Status
      { wpx: 150 }, // Diesel Engine Pump Status
      { wpx: 150 }, // Wet Risers Status
      { wpx: 150 }, // Hose Reel Cabinets Status
      { wpx: 150 }, // External Hydrants Status
      { wpx: 150 }, // Water Storage Tanks Status
      { wpx: 150 }, // Emergency Lights Status
      { wpx: 200 }, // Remarks
    ];
  
    // Set the column widths to the worksheet
    ws['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Firefighting Reports');
    XLSX.writeFile(wb, 'firefighting-reports.xlsx');
  };
  
  const exportToPDF = (data) => {
    const doc = new jsPDF('landscape');
  
    doc.text('Firefighting Reports', 14, 10);
  
    // Add headers for the firefighting data
    const headers = [
      'ID', 'Date', 'Firefighter Name', 'Addressable Smoke Status', 'Fire Alarming System Status', 
      'Diesel Engine Pump Status','Fire Extinguisher', 'Wet Risers Status', 'Hose Reel Cabinets Status', 
      'External Hydrants Status', 'Water Storage Tanks Status', 'Emergency Lights Status', 'Remarks'
    ];
  
    // Create the table data for each report
    const tableData = data.map((report) => [
      report.id,
      new Date(report.date).toLocaleDateString(),
      report.firefighterName,
      report.addressableSmokeStatus ? 'Working' : 'Not Working',
      report.fireAlarmingSystemStatus ? 'Working' : 'Not Working',
      report.fireextinguisherStatus? 'Working' : 'Not Working',
      report.dieselEnginePumpStatus ? 'Working' : 'Not Working',
      report.wetRisersStatus ? 'Working' : 'Not Working',
      report.hoseReelCabinetsStatus ? 'Working' : 'Not Working',
      report.externalHydrantsStatus ? 'Working' : 'Not Working',
      report.waterStorageTanksStatus ? 'Working' : 'Not Working',
      report.emergencyLightsStatus ? 'Working' : 'Not Working',
      report.remarks,
    ]);
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 20,
      theme: 'striped',
    });
  
    doc.save('firefighting-reports.pdf');
  };
  
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Firefighting Reports</h1>
        {/* Add Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href="/daily-maintenance/firefighting/add">
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
        <div className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              name="firefighterName"
              value={filters.firefighterName}
              onChange={handleFilterChange}
              placeholder="Firefighter Name"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              placeholder="Date From"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              placeholder="Date To"
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

        {/* Firefighting Reports Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{report.firefighterName}</h2>
              <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
              <p><strong>Remarks:</strong> {report.remarks}</p>
              <div className="flex space-x-6 mt-4">
                <Link href={`/daily-maintenance/firefighting/view/${report.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/firefighting/edit/${report.id}`}>
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
  const { page = 1, firefighterName = '', dateFrom = '', dateTo = '' } = query;

  try {
    const filters = [];
    if (firefighterName) filters.push({ firefighterName: { contains: firefighterName, mode: 'insensitive' } });
    if (dateFrom) filters.push({ date: { gte: new Date(dateFrom) } });
    if (dateTo) filters.push({ date: { lte: new Date(dateTo) } });

    const data = await prisma.fireFighting.findMany({
      where: filters.length > 0 ? { AND: filters } : {}, // Apply filters
      skip: (page - 1) * 10,
      take: 10,
      orderBy: { date: 'desc' },
    });

    // Serialize date fields to avoid JSON serialization error
    const serializedData = data.map((item) => ({
      ...item,
      date: item.date.toISOString(), // Convert Date object to string
    }));

    const totalReports = await prisma.fireFighting.count({
      where: filters.length > 0 ? { AND: filters } : {}, // Match filters
    });

    const nextPage = totalReports > page * 10;

    return {
      props: {
        initialData: serializedData, // Pass serialized data
        nextPage,
      },
    };
  } catch (error) {
    console.error('Error fetching firefighting data:', error);
    return {
      props: {
        initialData: [],
        nextPage: false,
      },
    };
  }
}



