// pages/security-services/daily-duty-security/view/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../../components/layout';

export default function ViewDailyDutySecurity() {
  const router = useRouter();
  const { id } = router.query;
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/daily-duty-security/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch record');
          }
          return res.json();
        })
        .then((data) => {
          console.log('Fetched Record:', data); // Debugging
          setRecord(data); // Set the fetched record
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching record:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!record) {
    return <div>Record not found.</div>;
  }
  const formatTime = (timeString) => {
    if (!timeString) return ''; // Handle empty values safely
  
    // Create a Date object assuming time is in UTC
    const [hours, minutes] = timeString.split(':');
    const utcDate = new Date(Date.UTC(1970, 0, 1, parseInt(hours, 10), parseInt(minutes, 10), 0)); 
  
    // Convert to local time
    return utcDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  

  return (
    <Layout>
      <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">Daily Duty Security Record</h1>

        {/* Record Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <p className="p-2 border border-gray-300 rounded bg-gray-100">{record.date}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift:</label>
            <p className="p-2 border border-gray-300 rounded bg-gray-100">{record.shift}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supervisor:</label>
            <p className="p-2 border border-gray-300 rounded bg-gray-100">{record.supervisorName || 'Unknown'}</p>
          </div>
        </div>

        {/* User Securities Table */}
        <h2 className="text-lg font-semibold mt-4 mb-2">User Securities</h2>
        {record.usersec && record.usersec.length > 0 ? (
          <table className="w-full border border-gray-300 text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Designation</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Time In</th>
                <th className="border p-2">Time Out</th>
              </tr>
            </thead>
            <tbody>
              {record.usersec.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.designation}</td>
                  <td className="border p-2">{user.location}</td>
                  <td className="border p-2">
                    {formatTime(user.timeIn)}
                  </td>
                  <td className="border p-2">
                    {formatTime(user.timeOut)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No user security records found.</p>
        )}
      </div>
    </Layout>
  );
}
