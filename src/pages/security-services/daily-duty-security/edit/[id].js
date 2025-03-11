import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

export default function EditDailyDutySecurityPage({ initialData }) {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    supervisor: '',
  });
  const [supervisors, setSupervisors] = useState([]); // Dynamic dropdown for Supervisor
  const [userSecurityList, setUserSecurityList] = useState([]);
  const [userSecurityEntry, setUserSecurityEntry] = useState({
    name: '',
    designation: '',
    timeIn: '',
    timeOut: '',
    location: '',
    userId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || '',
        shift: initialData.shift || '',
        supervisor: initialData.supervisor || '',
      });
      setUserSecurityList(initialData.usersec || []); // Populate user security list
    }
  }, [initialData]);

  // Fetch supervisors data
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          '/api/users/filtered?roles=Supervisor&departments=Security'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch supervisors');
        }
        const data = await response.json();
        setSupervisors(data || []);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      }
    };

    fetchSupervisors();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUserSecurityChange = (e) => {
    const { name, value } = e.target;
    setUserSecurityEntry((prevData) => ({ ...prevData, [name]: value }));
  };

  const addUserSecurityEntry = () => {
    if (
      !userSecurityEntry.name ||
      !userSecurityEntry.designation ||
      !userSecurityEntry.timeIn ||
      !userSecurityEntry.timeOut ||
      !userSecurityEntry.location
    ) {
      alert('Please fill out all required fields.');
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

  const removeUserSecurityEntry = (index) => {
    setUserSecurityList((prevList) => prevList.filter((_, i) => i !== index));
  };
  const handleEditUserSecurityTime = (e, index) => {
  const { name, value } = e.target;
  setUserSecurityList((prevList) =>
    prevList.map((entry, i) =>
      i === index ? { ...entry, [name]: value } : entry
    )
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedUsersec = userSecurityList.map((entry) => ({
      ...entry,
      timeIn: `${formData.date}T${entry.timeIn}`,
      timeOut: `${formData.date}T${entry.timeOut}`,
    }));

    const payload = {
      ...formData,
      usersec: sanitizedUsersec,
    };

    try {
      const response = await fetch(`/api/daily-duty-security/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/security-services/daily-duty-security');
      } else {
        const errorData = await response.json();
        console.error('Failed to update daily duty security:', errorData);
      }
    } catch (error) {
      console.error('Error updating daily duty security:', error);
    }
  };

  if (!initialData) return <div>Loading...</div>;

  
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Daily Duty Security</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Date */}
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

            {/* Shift Dropdown */}
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

            {/* Supervisor Dropdown */}
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

          {/* User Security Entries - Modern Corporate Styled */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-700">User Security Entries</h2>
  {userSecurityList.map((userSecurity, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-lg p-5 mb-4 border border-gray-200 transition hover:shadow-lg relative"
    >
      <button
        type="button"
        onClick={() => removeUserSecurityEntry(index)}
        className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition"
      >
        ✖
      </button>

      <p className="text-gray-800 text-lg font-medium mb-1">
        <span className="font-semibold text-gray-600">Name:</span> {userSecurity.name}
      </p>
      <p className="text-gray-700 text-sm mb-3">
        <span className="font-semibold text-gray-500">Designation:</span> {userSecurity.designation}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 font-semibold text-sm mb-1">Time In</label>
          <input
            type="time"
            name="timeIn"
            value={userSecurity.timeIn}
            onChange={(e) => handleEditUserSecurityTime(e, index)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold text-sm mb-1">Time Out</label>
          <input
            type="time"
            name="timeOut"
            value={userSecurity.timeOut}
            onChange={(e) => handleEditUserSecurityTime(e, index)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
          />
        </div>
      </div>

      <p className="text-gray-700 text-sm mt-4">
        <span className="font-semibold text-gray-500">Location:</span> {userSecurity.location}
      </p>
    </div>
  ))}



            {/* Add New User Security Entry */}
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
            Update
          </button>
        </form>
      </div>
    </Layout>
  );
}

// Fetch data server-side for pre-filling the form
export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/daily-duty-security/${params.id}`);

  if (!res.ok) {
    return { notFound: true };
  }

  const data = await res.json();

  // Function to adjust time from UTC to local
  const convertUTCToLocal = (timeString) => {
    if (!timeString) return '';

    // Create a Date object assuming the time is stored in UTC
    const [hours, minutes] = timeString.split(':');
    const utcDate = new Date(Date.UTC(1970, 0, 1, parseInt(hours, 10), parseInt(minutes, 10), 0)); 

    // Convert to local time
    return utcDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return {
    props: {
      initialData: {
        ...data,
        usersec: data.usersec.map((user) => ({
          ...user,
          timeIn: convertUTCToLocal(user.timeIn),
          timeOut: convertUTCToLocal(user.timeOut),
        })),
      },
    },
  };
}



