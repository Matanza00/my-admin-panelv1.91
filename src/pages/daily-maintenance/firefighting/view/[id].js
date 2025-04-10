import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const ViewFireFighting = () => {
  const router = useRouter();
  const { id, type } = router.query;
  const [firefightingRecord, setFirefightingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !type || (type !== 'firefighter' && type !== 'firefightingalarm')) return;

    fetch(`/api/firefighting/${id}?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setFirefightingRecord(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch record');
      })
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) return <div className="text-center text-gray-600 py-6">Loading record...</div>;
  if (error) return <div className="text-center text-red-600 py-6">{error}</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {type === 'firefighter' ? 'View Fire Alarm Inspection Report' : 'View Fire Fighter Inspection Report'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem label="Date" value={new Date(firefightingRecord.date).toLocaleDateString('en-GB')} />
          <InfoItem label="Technician Name" value={firefightingRecord.firefighterName} />
        </div>

        {/* Status Section */}
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-y-4 mt-6">
            {type === 'firefighter' ? (
              <>
                <StatusItem label="Addressable Smoke" status={firefightingRecord.addressableSmokeStatus} />
                <StatusItem label="Fire Alarming System" status={firefightingRecord.fireAlarmingSystemStatus} />
              </>
            ) : (
              <>
                <StatusItem label="Diesel Engine Fire Pump" status={firefightingRecord.dieselEnginePumpStatus} />
                <StatusItem label="Wet Risers" status={firefightingRecord.wetRisersStatus} />
                <StatusItem label="Hose Reel Cabinets" status={firefightingRecord.hoseReelCabinetsStatus} />
                <StatusItem label="External Hydrants" status={firefightingRecord.externalHydrantsStatus} />
                <StatusItem label="Water Storage Tanks" status={firefightingRecord.waterStorageTanksStatus} />
                <StatusItem label="Emergency Lights" status={firefightingRecord.emergencyLightsStatus} />
              </>
            )}
          </div>

          {/* Remarks */}
          <InfoItem label="Remarks" value={firefightingRecord.remarks || 'No remarks provided'} />
        </div>
      </div>
    </Layout>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="font-medium text-gray-700">{label}:</label>
    <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">{value}</div>
  </div>
);

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
