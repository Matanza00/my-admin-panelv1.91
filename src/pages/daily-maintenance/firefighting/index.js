import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function FirefightingPage({ initialData, nextPage, type }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const router = useRouter();
  const [userId, setUserId] = useState(null); // Store the user's ID
  const [userRole, setUserRole] = useState(null); // Store the user's role
  const [userDepartment, setUserDepartment ] = useState(null); //Store the user's Department
  // Fetch the current user's ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data?.user?.id) {
          setUserId(data.user.id); // Set the user ID
          setUserRole(data.user.role); // Set the user role
          setUserDepartment(data.user.department.name) // Set the user department
        } else {
          console.error('Failed to fetch user session');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUser();
  }, []);

  const [selectedTab, setSelectedTab] = useState(type || 'firefightingalarm' || 'firefighter'); // Default tab is firefighter
  const [filters, setFilters] = useState({
    firefighterName: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    applyFilters();
  }, [selectedTab]); // Fetch data when tab changes

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    const query = { page: 1, type: selectedTab, ...filters };
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
    const query = new URLSearchParams({ page: page + 1, type: selectedTab }).toString();
    const res = await fetch(`/api/firefighting?${query}`);
    const { data: newData, nextPage } = await res.json();

    setData((prevData) => [...prevData, ...newData]); // Append new records
    setPage(page + 1);
    setHasMore(nextPage);
  };

  const formatStatusKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase());
  };
  
  const exportToExcel = (dataToExport, type) => {
    if (!dataToExport || dataToExport.length === 0) return;
  
    const reportType =
      type === 'firefighter'
        ? 'Fire Fighter Inspection Report'
        : type === 'firefightingalarm'
        ? 'Fire Fighting Alarm Inspection Report'
        : 'Firefighting Report';
  
    let formattedData = [];
  
    dataToExport.forEach((item) => {
      const { firefighterName, date, remarks, ...rest } = item;
  
      const statusFields = Object.entries(rest).filter(
        ([key]) =>
          !['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdById'].includes(key)
      );
  
      statusFields.forEach(([statusKey, statusValue]) => {
        formattedData.push({
          Name: firefighterName,
          Date: new Date(date).toLocaleDateString(),
          'Status Type': formatStatusKey(statusKey),
          'Status Value': statusValue ? '✅ Working' : '❌ Not Working',
          Remarks: '',
        });
      });
  
      formattedData.push({
        Name: '',
        Date: '',
        'Status Type': '',
        'Status Value': '',
        Remarks: remarks,
      });
    });
  
    const worksheet = XLSX.utils.json_to_sheet([]);
  
    // Add title at A1
    XLSX.utils.sheet_add_aoa(worksheet, [[reportType]], { origin: 'A1' });
  
    // Merge A1:E1
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
  
    // Style Row 1 - Title
    worksheet['A1'].s = {
      font: {
        bold: true,
        sz: 16,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
      },
    };
  
    // Add actual table headers + data starting at A3
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3' });
  
    // Style Row 3 - Table Headings
    const headerKeys = Object.keys(formattedData[0]);
    const headerColumns = ['A', 'B', 'C', 'D', 'E'];
  
    headerColumns.forEach((col, index) => {
      const cell = `${col}3`;
      worksheet[cell].s = {
        font: {
          bold: true,
          sz: 12,
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      };
    });
  
    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Name
      { wch: 15 }, // Date
      { wch: 35 }, // Status Type
      { wch: 20 }, // Status Value
      { wch: 40 }, // Remarks
    ];
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Firefighting Reports');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, `${reportType}.xlsx`);
  };
  
  
  
  
  
  

  const exportToPDF = (dataToExport, type) => {
    if (!dataToExport || dataToExport.length === 0) return;
  
    const doc = new jsPDF();
    const reportType =
      type === 'firefighter'
        ? 'Fire Fighter Inspection Report'
        : type === 'firefightingalarm'
        ? 'Fire Fighting Alarm Inspection Report'
        : 'Firefighting Report';
  
    doc.setFontSize(18);
    doc.text(reportType, 14, 20);
  
    const allRows = [];
  
    dataToExport.forEach((item) => {
      const { firefighterName, date, remarks, ...rest } = item;
  
      const statusFields = Object.entries(rest).filter(
        ([key]) =>
          !['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdById'].includes(key)
      );
  
      statusFields.forEach(([statusKey, statusValue]) => {
        allRows.push([
          firefighterName,
          new Date(date).toLocaleDateString(),
          formatStatusKey(statusKey),
          statusValue ? 'Working' : 'Not Working',
          '', // Empty remarks
        ]);
      });
  
      // Final row for remarks
      allRows.push(['', '', '', 'Remarks', remarks]);
    });
  
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Date', 'Status Type', 'Status Value', 'Remarks']],
      body: allRows,
      styles: { cellPadding: 2 },
    });
  
    doc.save(`${reportType}.pdf`);
  };
  
  


  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Firefighting Inspection</h1>

        {/* Tabs for Firefighter and FireFightingAlarm */}
        {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'supervisor') && (
        <div className="flex border-b mb-6">
          <button
            onClick={() => setSelectedTab('firefighter')}
            className={`py-2 px-4 text-lg ${
              selectedTab === 'firefighter' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            Fire Alarm System
          </button>
          <button
            onClick={() => setSelectedTab('firefightingalarm')}
            className={`py-2 px-4 text-lg ${
              selectedTab === 'firefightingalarm' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            Fire Fighters
          </button>
        </div>
        )}
        {userRole !== 'admin' && userRole !== 'supervisor' && (
            <div className="flex border-b mb-6">
              {/* Only show user's own department tab */}
              <button className="py-2 px-4 text-lg border-b-2 border-blue-600 text-blue-600 font-semibold">
                {userDepartment === 'firefighter' ? 'Fire Alarm System' : 'Fire Fighters'}
              </button>
            </div>
          )}
        {/* Add Button */}
        <div className="flex justify-start items-center space-x-4 mb-6 mt-4">
          <Link href={`/daily-maintenance/firefighting/add?type=${selectedTab}`}>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow">
              Add New Report
            </button>
          </Link>
        </div>

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
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
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
        {/*Export Button*/}
        <button
          onClick={() => exportToExcel(data, selectedTab)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 m-4"
        >
          Export to Excel
        </button>

        <button
          onClick={() => exportToPDF(data, selectedTab)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Export to PDF
        </button>



        {/* Reports List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((report) => (
            <div key={report.id} className="bg-white border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">{report.firefighterName}</h2>
              <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
              <p><strong>Remarks:</strong> {report.remarks}</p>
              <div className="flex space-x-6 mt-4">
                <Link href={`/daily-maintenance/firefighting/view/${report.id}?type=${selectedTab}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/daily-maintenance/firefighting/edit/${report.id}?type=${selectedTab}`}>
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
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMoreData}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }

  const { query } = context;
  const {
    page = 1,
    firefighterName = '',
    dateFrom = '',
    dateTo = '',
    type = 'firefighter',
  } = query;

  const { role, department, name } = session.user;
  const normalizedRole = role.toLowerCase();
  const normalizedDepartment = department?.toLowerCase();

  let allowedType = type;

  // 🔐 Restrict tabs by role/department
  if (!['admin', 'supervisor', 'super_admin'].includes(normalizedRole)) {
    if (normalizedDepartment === 'firefighter' || normalizedDepartment === 'firefightingalarm') {
      allowedType = normalizedDepartment;

      if (type !== normalizedDepartment) {
        return {
          redirect: {
            destination: `/daily-maintenance/firefighting?type=${normalizedDepartment}`,
            permanent: false,
          },
        };
      }
    } else {
      return { notFound: true };
    }
  }

  try {
    const url = new URL(`${process.env.NEXTAUTH_URL}/api/firefighting`);
    url.searchParams.append('page', page);
    url.searchParams.append('dateFrom', dateFrom);
    url.searchParams.append('dateTo', dateTo);
    url.searchParams.append('type', allowedType);

    // ✅ Admins/Supervisors can search with filter or see all
    if (
      ['admin', 'super_admin', 'supervisor'].includes(normalizedRole) &&
      firefighterName
    ) {
      url.searchParams.append('firefighterName', firefighterName);
    }

    // ✅ Technicians should only see their own name
    if (normalizedRole === 'technician') {
      url.searchParams.append('firefighterName', name);
    }

    const res = await fetch(url.toString());
    const { data, nextPage } = await res.json();

    return {
      props: {
        initialData: data,
        nextPage,
        type: allowedType,
        userRole: normalizedRole,
        userDepartment: normalizedDepartment,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialData: [],
        nextPage: false,
        type: allowedType,
        userRole: normalizedRole,
        userDepartment: normalizedDepartment,
      },
    };
  }
}
