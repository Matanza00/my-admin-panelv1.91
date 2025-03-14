import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditFireFighting = () => {
  const router = useRouter();
  const { id, type = 'fireFighting' } = router.query; // Get type from query parameter

  // Define fields dynamically based on type
  const initialFormData = {
    firefighterId: '',
    date: '',
    remarks: '',
  };

  const firefightingFields = {
    addressableSmokeStatus: false,
    fireAlarmingSystemStatus: false,
  };

  const firefightingAlarmFields = {
    dieselEnginePumpStatus: false,
    wetRisersStatus: false,
    hoseReelCabinetsStatus: false,
    externalHydrantsStatus: false,
    waterStorageTanksStatus: false,
    emergencyLightsStatus: false,
  };

  const [formData, setFormData] = useState({
    ...initialFormData,
    ...(type === 'fireFighting' ? firefightingFields : firefightingAlarmFields),
  });

  const [firefighters, setFirefighters] = useState([]); // Dropdown for firefighters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && type) {
      fetch(`/api/firefighting/${id}?type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setFormData({
              ...data,
              firefighterId: data.firefighterId?.toString() || '',
            });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch data:', err);
          setError('Failed to fetch record');
        })
        .finally(() => setLoading(false));
    }

    // Fetch firefighters for the dropdown
    fetch('/api/users/filtered?roles=Technician&departments=FirefightingAlarm')
      .then((res) => res.json())
      .then((data) => setFirefighters(data))
      .catch((err) => console.error('Failed to fetch firefighters:', err));
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Handle checkboxes correctly
    }));
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure at least one field is being updated
    if (!formData.firefighterName) {
      alert('Please select a firefighter.');
      return;
    }
  
    const updatedData = {
      firefighterName: formData.firefighterName, // Send as name, not ID
      remarks: formData.remarks || '',
      addressableSmokeStatus: formData.addressableSmokeStatus ?? false,
      fireAlarmingSystemStatus: formData.fireAlarmingSystemStatus ?? false,
      dieselEnginePumpStatus: formData.dieselEnginePumpStatus ?? false,
      wetRisersStatus: formData.wetRisersStatus ?? false,
      hoseReelCabinetsStatus: formData.hoseReelCabinetsStatus ?? false,
      externalHydrantsStatus: formData.externalHydrantsStatus ?? false,
      waterStorageTanksStatus: formData.waterStorageTanksStatus ?? false,
      emergencyLightsStatus: formData.emergencyLightsStatus ?? false,
    };
  
    try {
      const response = await fetch(`/api/firefighting/${id}?type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        alert('Record updated successfully!');
        router.push(`/daily-maintenance/firefighting?type=${type}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update record');
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
          {type === 'fireFighting' ? 'Edit Fire Fighting Record' : 'Edit Fire Fighting Alarm Record'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Field */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Date:</label>
            <input
              type="text"
              name="date"
              value={new Date(formData.date).toLocaleString('en-GB')}
              disabled
              className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Firefighter Dropdown */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Firefighter Name:</label>
              <select
                name="firefighterName"
                value={formData.firefighterName} // Pre-populate from stored value
                onChange={handleChange}
                required
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Firefighter</option>
                {firefighters.map((firefighter) => (
                  <option key={firefighter.id} value={firefighter.name}>
                    {firefighter.name}
                  </option>
                ))}
              </select>
            </div>



          {/* Status Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
            {(type === 'fireFighting' ? [
              ['Addressable Smoke', 'addressableSmokeStatus'],
              ['Fire Alarming System', 'fireAlarmingSystemStatus'],
            ] : [
              ['Diesel Engine Fire Pump', 'dieselEnginePumpStatus'],
              ['Wet Risers', 'wetRisersStatus'],
              ['Hose Reel Cabinets', 'hoseReelCabinetsStatus'],
              ['External Hydrants', 'externalHydrantsStatus'],
              ['Water Storage Tanks', 'waterStorageTanksStatus'],
              ['Emergency Lights', 'emergencyLightsStatus'],
            ]).map(([label, field]) => (
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

          {/* Remarks Section */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Remarks:</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Update Record
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditFireFighting;
