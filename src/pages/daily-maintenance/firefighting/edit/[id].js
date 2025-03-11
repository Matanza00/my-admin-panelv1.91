import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditFireFighting = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    firefighterId: '', // Store firefighter ID
    addressableSmokeStatus: false,
    fireAlarmingSystemStatus: false,
    dieselEnginePumpStatus: false,
    fireextinguisherStatus: false,
    wetRisersStatus: false,
    hoseReelCabinetsStatus: false,
    externalHydrantsStatus: false,
    waterStorageTanksStatus: false,
    emergencyLightsStatus: false,
    remarks: '',
    date: '', // Add date field
  });

  const [firefighters, setFirefighters] = useState([]); // Dropdown data for firefighters

  useEffect(() => {
    if (id) {
      // Fetch data only when the ID is available
      fetch(`/api/firefighting/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            setFormData({
              ...data,
              firefighterId: data.firefighterId?.toString() || '', // Ensure firefighter ID is a string
            });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch data:', err);
          alert('Failed to fetch record');
        });
    }
    // Fetch firefighters for the dropdown
    fetch('/api/users/filtered?roles=Technician&departments=FirefightingAlarm')
      .then((res) => res.json())
      .then((data) => {
        setFirefighters(data);
      })
      .catch((err) => {
        console.error('Failed to fetch firefighters:', err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      firefighterId: parseInt(formData.firefighterId, 10), // Ensure it's an integer
      addressableSmokeStatus: Boolean(formData.addressableSmokeStatus),
      fireAlarmingSystemStatus: Boolean(formData.fireAlarmingSystemStatus),
      dieselEnginePumpStatus: Boolean(formData.dieselEnginePumpStatus),
      fireextinguisherStatus: Boolean(formData.fireextinguisherStatus),
      wetRisersStatus: Boolean(formData.wetRisersStatus),
      hoseReelCabinetsStatus: Boolean(formData.hoseReelCabinetsStatus),
      externalHydrantsStatus: Boolean(formData.externalHydrantsStatus),
      waterStorageTanksStatus: Boolean(formData.waterStorageTanksStatus),
      emergencyLightsStatus: Boolean(formData.emergencyLightsStatus),
      remarks: formData.remarks || '',
    };
    

    try {
      const response = await fetch(`/api/firefighting/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Record updated successfully!');
        router.push('/daily-maintenance/firefighting');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Firefighting Record</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Field */}
<div className="flex flex-col">
  <label className="font-medium text-gray-700">Date:</label>
  <input
    type="text"
    name="date"
    value={`${new Date(formData.date).toLocaleDateString('en-GB')} Time: ${String(new Date(formData.date).getHours()).padStart(2, '0')}:${String(new Date(formData.date).getMinutes()).padStart(2, '0')}:${String(new Date(formData.date).getSeconds()).padStart(2, '0')}`} // Format the date and time
    disabled
    className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
  />
</div>


          {/* Firefighter Dropdown */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Firefighter Name:</label>
            <select
              name="firefighterId"
              value={formData.firefighterId}
              onChange={handleChange}
              required
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Firefighter</option>
              {firefighters.map((firefighter) => (
                <option key={firefighter.id} value={firefighter.id.toString()}>
                  {firefighter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
            {[
              ['Addressable Smoke Status', 'addressableSmokeStatus'],
              ['Fire Alarming System Status', 'fireAlarmingSystemStatus'],
              ['Diesel Engine Firefighting Pump Status', 'dieselEnginePumpStatus'],
              ['Fire Extinguisher Status', 'fireextinguisherStatus'],
              ['Wet Risers Status', 'wetRisersStatus'],
              ['Hose Reel Cabinets Status', 'hoseReelCabinetsStatus'],
              ['External Hydrants Status', 'externalHydrantsStatus'],
              ['Water Storage Tanks Status', 'waterStorageTanksStatus'],
              ['Emergency Lights Status', 'emergencyLightsStatus'],
            ].map(([label, field]) => (
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
