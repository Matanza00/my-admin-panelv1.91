import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';

export default function FirefightingPage({ initialData, nextPage, type }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage);
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(type || 'fireFighting'); // Default tab is FireFighting
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

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Firefighting Reports</h1>

        {/* Tabs for FireFighting and FireFightingAlarm */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setSelectedTab('fireFighting')}
            className={`py-2 px-4 text-lg ${
              selectedTab === 'fireFighting' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            Fire Fighting
          </button>
          <button
            onClick={() => setSelectedTab('fireFightingAlarm')}
            className={`py-2 px-4 text-lg ${
              selectedTab === 'fireFightingAlarm' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            Fire Fighting Alarm
          </button>
        </div>

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

export async function getServerSideProps({ query }) {
  const { page = 1, firefighterName = '', dateFrom = '', dateTo = '', type = 'fireFighting' } = query;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/firefighting?page=${page}&firefighterName=${firefighterName}&dateFrom=${dateFrom}&dateTo=${dateTo}&type=${type}`
    );
    const { data, nextPage } = await res.json();

    return {
      props: {
        initialData: data,
        nextPage,
        type,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: { initialData: [], nextPage: false, type } };
  }
}
