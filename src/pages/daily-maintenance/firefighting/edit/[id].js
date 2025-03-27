import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditFireFighting = () => {
  const router = useRouter();
  const { id, type } = router.query;

  const [formData, setFormData] = useState({
    firefighterId: '',
    date: '',
    remarks: '',
  });

  const [firefighters, setFirefighters] = useState([]);
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
          setFormData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch record');
      })
      .finally(() => setLoading(false));

    // Fetch firefighters
    fetch(`/api/users/filtered?departments=${type}`)
      .then((res) => res.json())
      .then((data) => setFirefighters(data))
      .catch((err) => console.error('Failed to fetch firefighters:', err));
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/firefighting/${id}?type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Record updated successfully!');
        router.push(`/daily-maintenance/firefighting?type=${type}`);
      } else {
        alert('Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record');
    }
  };

  if (loading) return <div className="text-center text-gray-600 py-6">Loading record...</div>;
  if (error) return <div className="text-center text-red-600 py-6">{error}</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {type === 'firefighter' ? 'Edit Fire Alarm Inspection Report' : 'Edit Fire Fighter Inspection Report'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InfoItem label="Date" value={new Date(formData.date).toLocaleDateString('en-GB')} />

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Technician Name:</label>
            <select
              name="firefighterName"
              value={formData.firefighterName}
              onChange={handleChange}
              required
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Technician</option>
              {firefighters.map((firefighter) => (
                <option key={firefighter.id} value={firefighter.name}>
                  {firefighter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
            {(type === 'firefighter'
              ? [
                  ['Addressable Smoke', 'addressableSmokeStatus'],
                  ['Fire Alarming System', 'fireAlarmingSystemStatus'],
                ]
              : [
                  ['Diesel Engine Fire Pump', 'dieselEnginePumpStatus'],
                  ['Wet Risers', 'wetRisersStatus'],
                  ['Hose Reel Cabinets', 'hoseReelCabinetsStatus'],
                  ['External Hydrants', 'externalHydrantsStatus'],
                  ['Water Storage Tanks', 'waterStorageTanksStatus'],
                  ['Emergency Lights', 'emergencyLightsStatus'],
                ]
            ).map(([label, field]) => (
              <div key={field} className="flex items-center">
                <label className="w-2/3 text-gray-700">{label}:</label>
                <input
                  type="checkbox"
                  name={field}
                  checked={formData[field]}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>



          {/* Submit Button */}
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Update Record
          </button>
        </form>
      </div>
    </Layout>
  );
};

// ✅ **Added Missing Component**
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="font-medium text-gray-700">{label}:</label>
    <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">{value}</div>
  </div>
);

export default EditFireFighting;
