import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";

const TenantView = () => {
  const router = useRouter();
  const { id } = router.query; // Get tenant ID from the URL query
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tenant data when the component mounts or the ID changes
  useEffect(() => {
    if (!id) return;

    const fetchTenantData = async () => {
      try {
        const res = await fetch(`/api/tenants/${id}`);
        if (!res.ok) {
          throw new Error("Tenant not found");
        }
        const data = await res.json();
        setTenant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [id]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-4">Error: {error}</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tenant Details</h1>
        </div>

        {tenant ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">{tenant.tenantName}</h2>
            <h2 className="text-2xl font-semibold text-gray-800">{tenant.userName}</h2>
            <p className="text-lg text-gray-600 mt-4">Total Area: {tenant.totalAreaSq} Sq.ft</p>

            <h3 className="text-xl font-medium text-gray-700 mt-6">Associated Areas (Sq.ft)</h3>
            {tenant.area && tenant.area.length > 0 ? ( // Check if `area` exists and has items
              <ul className="mt-4 space-y-4">
                {tenant.area.map((area) => (
                  <li key={area.id} className="bg-gray-100 p-4 rounded-md shadow-md">
                    <div className="font-bold text-gray-800">{area.areaName || "No Area Name"}</div>
                    <div className="text-sm text-gray-600">Floor: {area.floor || "N/A"}</div>
                    <div className="text-sm text-gray-600">Occupied Area: {area.occupiedArea || 0} Sq.ft</div>
                    <div className="text-sm text-gray-600">Location: {area.location || "N/A"}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-600">No areas associated with this tenant</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">No tenant data found</p>
        )}
      </div>
    </Layout>
  );
};

export default TenantView;
