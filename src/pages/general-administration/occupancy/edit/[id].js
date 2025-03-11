// pages/general-administration/occupancy/edit/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

export default function EditOccupancy({ occupancy }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tenantId: occupancy.tenantId || '',
    totalArea: occupancy.totalArea || '',
    rentedArea: occupancy.rentedArea || '',
    occupancyArea: occupancy.occupancyArea || '',
  });

  useEffect(() => {
    if (occupancy) {
      setFormData({
        tenantId: occupancy.tenantId,
        totalArea: occupancy.totalArea,
        rentedArea: occupancy.rentedArea,
        occupancyArea: occupancy.occupancyArea,
      });
    }
  }, [occupancy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/occupancy/${router.query.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/general-administration/occupancy');
    } else {
      console.error('Failed to update occupancy');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Occupancy</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant ID</label>
            <input
              type="text"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Area</label>
            <input
              type="number"
              name="totalArea"
              value={formData.totalArea}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rented Area</label>
            <input
              type="number"
              name="rentedArea"
              value={formData.rentedArea}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Occupancy Area</label>
            <input
              type="number"
              name="occupancyArea"
              value={formData.occupancyArea}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/occupancy/${params.id}`);
  const occupancy = await res.json();

  if (!occupancy) {
    return { notFound: true };
  }

  return {
    props: {
      occupancy,
    },
  };
}
