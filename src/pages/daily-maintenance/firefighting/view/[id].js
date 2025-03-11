import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const ViewFireFighting = () => {
  const router = useRouter();
  const { id } = router.query;

  const [firefightingRecord, setFirefightingRecord] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch data when the ID is available
      fetch(`/api/firefighting/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            setFirefightingRecord(data); // Set data when fetched
          }
        })
        .catch((err) => {
          console.error('Failed to fetch data:', err);
          alert('Failed to fetch record');
        });
    }
  }, [id]);

  if (!firefightingRecord) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">View Firefighting Record</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Display Date */}
<div className="flex flex-col">
  <label className="font-medium text-gray-700">Date:</label>
  <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
    {`${new Date(firefightingRecord.date).toLocaleDateString('en-GB')} Time: ${String(new Date(firefightingRecord.date).getHours()).padStart(2, '0')}:${String(new Date(firefightingRecord.date).getMinutes()).padStart(2, '0')}:${String(new Date(firefightingRecord.date).getSeconds()).padStart(2, '0')}`}
  </div>
</div>


          {/* Display Firefighter Name */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Firefighter Name:</label>
            <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
              {firefightingRecord.firefighterName}
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          {/* Display Statuses */}
          <div className="grid grid-cols-1 gap-y-4 mt-6">
            <StatusItem label="Addressable Smoke" status={firefightingRecord.addressableSmokeStatus} />
            <StatusItem label="Fire Alarming System" status={firefightingRecord.fireAlarmingSystemStatus} />
            <StatusItem label="Diesel Engine Firefighting Pump" status={firefightingRecord.dieselEnginePumpStatus} />
            <StatusItem label="Fire Extinguisher" status={firefightingRecord.fireextinguisherStatus} />
            <StatusItem label="Wet Risers" status={firefightingRecord.wetRisersStatus} />
            <StatusItem label="Hose Reel Cabinets" status={firefightingRecord.hoseReelCabinetsStatus} />
            <StatusItem label="External Hydrants" status={firefightingRecord.externalHydrantsStatus} />
            <StatusItem label="Water Storage Tanks" status={firefightingRecord.waterStorageTanksStatus} />
            <StatusItem label="Emergency Lights" status={firefightingRecord.emergencyLightsStatus} />
          </div>

          {/* Display Remarks */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Remarks:</label>
            <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
              {firefightingRecord.remarks || 'No remarks provided'}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper Component to display status items
const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between">
    <label className="text-lg font-medium text-gray-700 w-1/2">{label}:</label>
    <div
      className={`w-1/2 text-center px-4 py-2 rounded-md font-bold ${
        status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {status ? 'Active' : 'Inactive'}
    </div>
  </div>
);


export default ViewFireFighting;
