import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';

export default function AddFirefightingPage() {
  const [formData, setFormData] = useState({
    firefighterId: '', // Store firefighter ID
    date: '',
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
  });

  const [firefighters, setFirefighters] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState(null); // Store the user's ID
  // Fetch the current user's ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data?.user?.id) {
          setUserId(data.user.id); // Set the user ID
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
        const res = await fetch(
          '/api/users/filtered?roles=Technician&departments=FirefightingAlarm'
        );
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
        body: JSON.stringify({ ...formData, createdById: userId }), // Include createdById
      });

      if (res.ok) {
        router.push('/daily-maintenance/firefighting');
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
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Add Firefighting Report</h1>

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

          {/* Status Checkboxes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            {[
              'addressableSmokeStatus',
              'fireAlarmingSystemStatus',
              'dieselEnginePumpStatus',
              'fireextinguisherStatus',
              'wetRisersStatus',
              'hoseReelCabinetsStatus',
              'externalHydrantsStatus',
              'waterStorageTanksStatus',
              'emergencyLightsStatus',
            ].map((field) => (
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
