import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const ViewWaterManagement = () => {
  const router = useRouter();
  const { id } = router.query;
  const [waterManagement, setWaterManagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchWaterManagement = async () => {
      try {
        const response = await fetch(`/api/water-management/${id}`);
        const data = await response.json();

        if (response.ok) {
          setWaterManagement(data);
        } else {
          throw new Error(data.error || 'Error fetching data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterManagement();
  }, [id]);
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return `${formattedDate} Time: ${time}`;
  }

  if (loading) return <div className="text-center py-4 text-lg text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600 text-lg">Error: {error}</div>;
  if (!waterManagement) return <div className="text-center py-4 text-gray-600 text-lg">No data available</div>;
  console.log('Water Management Data:', waterManagement);
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8 bg-gray-900 rounded-lg shadow-lg">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{waterManagement.title}</h1>
          <p className="text-gray-300 mt-2">{waterManagement.description}</p>
        </div>

        {/* Supervisors */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="text-lg text-gray-300 font-medium">Supervisor</h3>
              <p className="text-white">{waterManagement.supervisorName}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="text-lg text-gray-300 font-medium">Operator</h3>
              <p className="text-white">{waterManagement.operatorName}</p>
            </div>
            
          </div>
        </div>

        {/* Pumps */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-white mb-4">Pumps</h2>
          {waterManagement.pumps.length === 0 ? (
            <p className="text-gray-400">No pumps available</p>
          ) : (
            <div className="space-y-6">
              {waterManagement.pumps.map((pump) => (
                <div key={pump.id} className="bg-gray-700 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{pump.name}</h3>
                    <span className="text-sm text-gray-400">ID: {pump.id}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p>
                      <strong className="text-gray-300">Location:</strong> <span className="text-white">{pump.location}</span>
                    </p>
                    <p>
                      <strong className="text-gray-300">Capacity:</strong> <span className="text-white">{pump.capacity} L/min</span>
                    </p>
                  </div>

                  {/* Pump Checks */}
<div className="mt-6">
  <h4 className="text-lg font-medium text-gray-300">Checks</h4>
  {(!pump.checks || pump.checks.length === 0) ? (
  <p className="text-gray-400 mt-2">No checks available for this pump</p>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
    {pump.checks.map((check, index) => {
      if (!check || typeof check !== 'object') {
        return (
          <div key={index} className="bg-gray-800 p-3 rounded-md">
            <p className="text-gray-300">Invalid check data</p>
          </div>
        );
      }
      return Object.entries(check)
        .filter(([key]) => !['id', 'pumpId', 'createdAt', 'updatedAt'].includes(key)) // Exclude unwanted keys
        .map(([key, value]) => (
          <div key={`${key}-${index}`} className="bg-gray-800 p-3 rounded-md">
            <p className="text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}:
            </p>
            <p className="text-white">
              {key.toLowerCase().includes('date') && typeof value === 'string'
                ? formatDate(value)
                : value || 'N/A'}
            </p>
          </div>
        ));
    })}
  </div>
)}
</div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewWaterManagement;
