import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';

export default function AddFirefightingPage() {
  const router = useRouter();
  const { type = 'fireFighting' } = router.query; // Determine type (default is fireFighting)

  // Define the form fields dynamically based on type
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

  const [firefighters, setFirefighters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch the current user's ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data?.user?.id) {
          setUserId(data.user.id);
        } else {
          console.error('Failed to fetch user session');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch firefighters from the API
  useEffect(() => {
    const fetchFirefighters = async () => {
      try {
        const res = await fetch('/api/users/filtered?roles=Technician&departments=FirefightingAlarm');
        if (!res.ok) throw new Error('Failed to fetch firefighters');
        const data = await res.json();
        setFirefighters(data);
      } catch (error) {
        console.error('Error fetching firefighters:', error);
      }
    };

    fetchFirefighters();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/firefighting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, createdById: userId, type }), // Pass type
      });

      if (res.ok) {
        router.push(`/daily-maintenance/firefighting?type=${type}`);
      } else {
        alert('Failed to add report');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">
          {type === 'fireFighting' ? 'Add Fire Fighting Report' : 'Add Fire Fighting Alarm Report'}
        </h1>

        {/* Tabs for FireFighting and FireFightingAlarm */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => router.push('/daily-maintenance/firefighting/add?type=fireFighting')}
            className={`py-2 px-4 text-lg ${
              type === 'fireFighting' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            Fire Fighting
          </button>
          <button
            onClick={() => router.push('/daily-maintenance/firefighting/add?type=fireFightingAlarm')}
            className={`py-2 px-4 text-lg ${
              type === 'fireFightingAlarm' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            Fire Fighting Alarm
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown for Firefighter Name */}
          <div>
            <label htmlFor="firefighterId" className="block text-sm font-medium text-gray-700">
              Firefighter Name
            </label>
            <select
              id="firefighterId"
              name="firefighterId"
              value={formData.firefighterId}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md w-full"
              required
            >
              <option value="">Select Firefighter</option>
              {firefighters.map((firefighter) => (
                <option key={firefighter.id} value={firefighter.id}>
                  {firefighter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md w-full"
              required
            />
          </div>

          {/* Status Checkboxes (Dynamic based on type) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            {Object.keys(type === 'fireFighting' ? firefightingFields : firefightingAlarmFields).map((field) => (
              <div key={field} className="flex items-center">
                <input
                  type="checkbox"
                  id={field}
                  name={field}
                  checked={formData[field]}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={field} className="text-sm text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
              </div>
            ))}
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Report'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
