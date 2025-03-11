import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const TenantEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    tenantName: '',
    userName: '', // Store the fetched user name here
    totalAreaSq: 0,
    areas: [],
  });
  const [tenants, setTenants] = useState([]); // State for tenants dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tenant data and all tenants
  useEffect(() => {
    if (!id) return;

    const fetchTenantData = async () => {
      try {
        // Fetch tenant details
        const tenantRes = await fetch(`/api/tenants/${id}`);
        if (!tenantRes.ok) throw new Error('Tenant not found');
        const tenantData = await tenantRes.json();

        // Fetch tenants for the dropdown
        const tenantsRes = await fetch('/api/users/filtered?roles=tenant');
        if (!tenantsRes.ok) throw new Error('Failed to fetch tenants');
        const tenantList = await tenantsRes.json();

        setTenants(tenantList); // Populate dropdown options
        setFormData({
          tenantName: tenantData.tenantName, // Use the original tenant name
          userName: tenantData.userName, // Display user name
          totalAreaSq: tenantData.totalAreaSq,
          areas: tenantData.area || [],
        });
        console.log("tenantRes",tenantRes);
        console.log("tenantData",tenantData)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAreas = [...formData.areas];
    updatedAreas[index] = { ...updatedAreas[index], [name]: value };
  
    // Recalculate total occupied area
    const totalOccupiedArea = updatedAreas.reduce((sum, area) => sum + (parseFloat(area.occupiedArea) || 0), 0);
  
    setFormData((prev) => ({
      ...prev,
      areas: updatedAreas,
      totalAreaSq: totalOccupiedArea, // Automatically update Total Area (Sqft)
    }));
  };
  

  const addArea = () => {
    setFormData((prev) => ({
      ...prev,
      areas: [...prev.areas, { floor: '', occupiedArea: '', location: '' }],
    }));
  };

  const removeArea = (index) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tenantId: formData.tenantId, // Send tenantId instead of tenantName
      totalAreaSq: parseFloat(formData.totalAreaSq),
      areas: formData.areas.map((area) => ({
        floor: area.floor,
        occupiedArea: parseFloat(area.occupiedArea),
        location: area.location,
      })),
    };

    console.log('Submitting payload:', payload);

    try {
      const res = await fetch(`/api/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log("Response",res)

      if (!res.ok) throw new Error('Failed to update tenant');
      alert('Tenant updated successfully!');
      router.push(`/general-administration/tenants/view/${id}`);
    } catch (err) {
      console.error('Error updating tenant:', err.message);
      alert('Error updating tenant. Check console for details.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Tenant</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Tenant Name</label>
          <input
            type="text"
            value={formData.tenantName}
            className="w-full p-2 border rounded bg-gray-100"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">User Name</label>
          <input
            type="text"
            value={formData.userName}
            className="w-full p-2 border rounded bg-gray-100"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Total Area (Sq.ft)</label>
          <input
            type="number"
            value={formData.totalAreaSq}
            className="w-full p-2 border rounded bg-gray-100"
            disabled
          />
        </div>
          <h3 className="text-lg font-medium mb-4">Associated Areas (Sq.ft)</h3>
          {formData.areas.map((area, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <input
                type="text"
                name="floor"
                placeholder="Floor"
                value={area.floor}
                onChange={(e) => handleAreaChange(index, e)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="number"
                name="occupiedArea"
                placeholder="Occupied Area"
                value={area.occupiedArea}
                onChange={(e) => handleAreaChange(index, e)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={area.location}
                onChange={(e) => handleAreaChange(index, e)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button type="button" onClick={() => removeArea(index)} className="text-red-600">
                Remove Area
              </button>
            </div>
          ))}
          <button type="button" onClick={addArea} className="mb-4 text-blue-600">
            + Add Area
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default TenantEdit;
