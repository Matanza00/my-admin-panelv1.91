import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiEye, HiOutlinePencil, HiOutlineTrash, HiFilter } from 'react-icons/hi';
import Layout from '../../../components/layout';

export default function TenantsPage({ initialData, nextPage }) {
  const [data, setData] = useState(initialData || []); // Default to empty array
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(nextPage || false); // Default to false
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    tenantName: '',
    totalAreaMin: '',
    totalAreaMax: '',
  });

  useEffect(() => {
    // Log the initial data when the component mounts
    console.log('Initial Data:', data);
  }, [data]);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    const query = new URLSearchParams({ ...filters, page: 1 }).toString();
    try {
      console.log('Applying filters with query:', query); // Log filter query
      const res = await fetch(`/api/tenants?${query}`);
      if (!res.ok) throw new Error('Failed to fetch filtered tenants.');
      const { data: filteredData, nextPage } = await res.json();

      console.log('Filtered Data:', filteredData); // Log filtered data
      setData(filteredData || []);
      setPage(1);
      setHasMore(nextPage || false);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const loadMoreData = async () => {
    const query = new URLSearchParams({ ...filters, page: page + 1 }).toString();
    try {
      console.log('Loading more data with query:', query); // Log load more query
      const res = await fetch(`/api/tenants?${query}`);
      if (!res.ok) throw new Error('Failed to load more tenants.');
      const { data: newData, nextPage } = await res.json();

      console.log('New Data:', newData); // Log new data
      setData((prevData) => [...prevData, ...(newData || [])]);
      setPage(page + 1);
      setHasMore(nextPage || false);
    } catch (error) {
      console.error('Error loading more tenants:', error);
    }
  };

  const handleSoftDelete = async (tenantId) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;
  
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Failed to soft delete tenant');
  
      // Update UI by removing the deleted tenant
      setData((prevData) => prevData.filter((tenant) => tenant.id !== tenantId));
    } catch (error) {
      console.error('Error soft deleting tenant:', error);
      alert('Failed to delete tenant.');
    }
  };
  
  const url = `${process.env.BASE_URL}/api/tenants`;
console.log('Constructed URL:', url);

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Tenants</h1>

        {/* Filter Button */}
        <button
          onClick={toggleFilter}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg flex justify-between items-center hover:bg-indigo-700 transition duration-300 mb-6"
        >
          <span className="text-lg">Filters</span>
          <HiFilter className="text-lg" />
        </button>

        {/* Collapsible Filter Section */}
        {isFilterOpen && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="font-semibold text-xl mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder="Tenant Name"
                name="tenantName"
                value={filters.tenantName}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Min Total Area"
                name="totalAreaMin"
                value={filters.totalAreaMin}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Max Total Area"
                name="totalAreaMax"
                value={filters.totalAreaMax}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={applyFilters}
              className="mt-4 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Add Tenant Button */}
        <div className="text-right mb-6">
          <Link
            href="/general-administration/tenants/add"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300"
          >
            + Add New Tenant
          </Link>
        </div>

        {/* Tenants Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{tenant.tenantName}</h2>
              <p className="text-gray-600 mb-2"><strong>Total Area (Sq.ft):</strong> {tenant.totalAreaSq}</p>
              <div className="flex space-x-6 mt-4">
                <Link href={`/general-administration/tenants/view/${tenant.id}`}>
                  <div className="text-green-600 hover:text-green-800 flex items-center cursor-pointer">
                    <HiEye className="mr-2" /> View
                  </div>
                </Link>
                <Link href={`/general-administration/tenants/edit/${tenant.id}`}>
                  <div className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer">
                    <HiOutlinePencil className="mr-2" /> Edit
                  </div>
                </Link>
                <div className="text-red-600 hover:text-red-800 flex items-center cursor-pointer" onClick={() => handleSoftDelete(tenant.id)}>
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
          <div className="mt-8 text-center text-gray-500">No more tenants to load.</div>
        )}
      </div>
    </Layout>
  );
}



export async function getServerSideProps({ query }) {
  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/tenants?${new URLSearchParams(query).toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch tenants. Status: ${res.status}`);
    }

    const { data, nextPage } = await res.json();

    console.log('Fetched Data from API:', data);

    return {
      props: {
        initialData: data || [],
        nextPage: nextPage || false,
      },
    };
  } catch (error) {
    console.error('Error fetching tenants:', error.message, error.stack);
    return {
      props: {
        initialData: [],
        nextPage: false,
      },
    };
  }
}
