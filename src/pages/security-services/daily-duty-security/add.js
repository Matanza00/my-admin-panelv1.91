// pages/security-services/daily-duty-security/add.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';

export default function AddDailyDutySecurityPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    supervisor: '',
  });
  const [supervisors, setSupervisors] = useState([]);
  const [userSecurityList, setUserSecurityList] = useState([]);
  const [userSecurityEntry, setUserSecurityEntry] = useState({
    name: '',
    designation: '',
    timeIn: '',
    timeOut: '',
    location: '',
    userId: '',
  });
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

  // Fetch supervisor data for dropdown
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          '/api/users/filtered?roles=Supervisor&departments=Security'
        );
        const data = await response.json();
        setSupervisors(data || []);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      }
    };

    fetchSupervisors();
  }, []);

  // Update form data
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Update user security entry data
  const handleUserSecurityChange = (e) => {
    const { name, value } = e.target;
    setUserSecurityEntry((prevData) => ({ ...prevData, [name]: value }));
  };

  // Add a user security entry to the list
  const addUserSecurityEntry = () => {
    if (
      !userSecurityEntry.name ||
      !userSecurityEntry.designation ||
      !userSecurityEntry.timeIn ||
      !userSecurityEntry.timeOut ||
      !userSecurityEntry.location ||
      !userSecurityEntry.userId
    ) {
      alert('Please fill out all fields for the user security entry.');
      return;
    }

    setUserSecurityList((prevList) => [...prevList, userSecurityEntry]);
    setUserSecurityEntry({
      name: '',
      designation: '',
      timeIn: '',
      timeOut: '',
      location: '',
      userId: '',
    });
  };

  // Remove a user security entry from the list
  const removeUserSecurityEntry = (index) => {
    setUserSecurityList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Submit form data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      usersec: userSecurityList.map((entry) => ({
        ...entry,
        timeIn: `${formData.date}T${entry.timeIn}:00`,
        timeOut: `${formData.date}T${entry.timeOut}:00`,
      })),
    };
    console.log({ ...payload, createdById: userId })

    try {
      const res = await fetch('/api/daily-duty-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, createdById: userId }), // Include createdById,
      });
      if (res.ok) {
        router.push('/security-services/daily-duty-security');
      } else {
        const errorData = await res.json();
        console.error('Failed to submit:', errorData.error);
        alert(errorData.error || 'An error occurred while submitting the report.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred. Please try again.');
    }
  };
  const formatTime = (timeString) => {
    if (!timeString) return ''; // Handle empty values safely
  
    const [hours, minutes] = timeString.split(':'); // Extract hours & minutes
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0); // Set local time
  
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Add Daily Duty Security</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Shift</label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="" disabled>
                  Select Shift
                </option>
                <option value="Morning">Morning</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Supervisor</label>
              <select
                name="supervisor"
                value={formData.supervisor}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="" disabled>
                  Select Supervisor
                </option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">User Security Entries</h2>
            {userSecurityList.map((userSecurity, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 relative">
                <button
                  type="button"
                  onClick={() => removeUserSecurityEntry(index)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  Remove
                </button>
                <p><strong>Name:</strong> {userSecurity.name}</p>
                <p><strong>Designation:</strong> {userSecurity.designation}</p>
                <p><strong>Time In:</strong> {userSecurity.timeIn}</p>
                <p><strong>Time Out:</strong> {userSecurity.timeOut}</p>
                <p><strong>Location:</strong> {userSecurity.location}</p>
                <p><strong>User ID:</strong> {userSecurity.userId}</p>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={userSecurityEntry.name}
                onChange={handleUserSecurityChange}
                className="border border-gray-300 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Designation"
                name="designation"
                value={userSecurityEntry.designation}
                onChange={handleUserSecurityChange}
                className="border border-gray-300 rounded-lg p-2"
              />
              <input
                type="time"
                placeholder="Time In"
                name="timeIn"
                value={userSecurityEntry.timeIn}
                onChange={handleUserSecurityChange}
                className="border border-gray-300 rounded-lg p-2"
              />
              <input
                type="time"
                placeholder="Time Out"
                name="timeOut"
                value={userSecurityEntry.timeOut}
                onChange={handleUserSecurityChange}
                className="border border-gray-300 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Location"
                name="location"
                value={userSecurityEntry.location}
                onChange={handleUserSecurityChange}
                className="border border-gray-300 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="User ID"
                name="userId"
                value={userSecurityEntry.userId}
                onChange={handleUserSecurityChange}
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <button
              type="button"
              onClick={addUserSecurityEntry}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Add User Security Entry
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}
