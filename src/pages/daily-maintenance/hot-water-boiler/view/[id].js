import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../../components/layout';

export default function HotWaterBoilerViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  // Format date as string (e.g., "2024-11-21")
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return `${formattedDate} Time: ${time}`;
  }
  

  // Format time as string (e.g., "14:30:00")
  const formatTime = (time) => {
    const formattedTime = new Date(time);
    return isNaN(formattedTime.getTime()) ? 'Invalid Time' : formattedTime.toLocaleTimeString();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/hot-water-boiler/${id}`);
          if (res.ok) {
            const result = await res.json();
            setData(result);
            console.log(result);
          } else {
            console.error('Failed to fetch data', await res.json());
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Hot Water Boiler Report Details</h1>

        {/* Boiler Details */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Boiler Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600">
            <p><strong>Date:</strong> {formatDate(data.Date)}</p>
            <p><strong>Start Time:</strong> {formatTime(data.StartTime)}</p>
            <p><strong>Shutdown Time:</strong> {formatTime(data.ShutdownTime)}</p>
            <p><strong>Operator:</strong> {data.OperatorName}</p>
            <p><strong>Supervisor:</strong> {data.SupervisorName}</p>
            <p><strong>Remarks:</strong> {data.Remarks || 'N/A'}</p>
          </div>
        </div>

        {/* TimeHour Reports */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Time Hour Reports</h2>
          {data.TimeHr && data.TimeHr.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Hot Water In (°F)</th>
                    <th className="border border-gray-300 px-4 py-2">Hot Water Out (°F)</th>
                    <th className="border border-gray-300 px-4 py-2">Exhaust Temp (°F)</th>
                    <th className="border border-gray-300 px-4 py-2">Furnace Pressure (°psi)</th>
                    <th className="border border-gray-300 px-4 py-2">Assistant Supervisor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.TimeHr.map((report) => (
                    <tr key={report.id} className="text-gray-600">
                      <td className="border border-gray-300 px-4 py-2">{formatTime(report.time)}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.HotWaterIn}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.HotWaterOut}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.ExhaustTemp}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.FurnacePressure}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.assistantSupervisor || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No time hour reports available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
