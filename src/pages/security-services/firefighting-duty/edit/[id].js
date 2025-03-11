import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditFirefightingDuty = () => {
  const [duty, setDuty] = useState(null);
  const [shift, setShift] = useState('');
  const [date, setDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // Array of selected users
  const [allUsers, setAllUsers] = useState([]); // All users list
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users list
  const router = useRouter();
  const { id } = router.query;

  // Fetch firefighting duty and available users
  useEffect(() => {
    if (id) {
      // Fetch firefighting duty details
      fetch(`/api/firefightingduty/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDuty(data);
          setShift(data.shift);
          setDate(data.date.split('T')[0]); // Set date to YYYY-MM-DD
          setSelectedUsers(data.users || []); // Pre-fill selected users
        })
        .catch((err) => console.error('Error fetching duty details:', err));

      // Fetch all users
      fetch(`/api/users/filtered?departments=security`)
        .then((res) => res.json())
        .then((data) => {
          console.log('All users fetched:', data); // Log the fetched users
          setAllUsers(data || []); // Populate all users list
        })
        .catch((err) => console.error('Error fetching users:', err));
    }
  }, [id]);

  // Filter available users dynamically
  useEffect(() => {
    console.log('Selected users:', selectedUsers); // Log selected users
    console.log('All users:', allUsers); // Log all users
    // Filter out selected users from all users
    setFilteredUsers(
      allUsers.filter(
        (user) => !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
      )
    );
  }, [allUsers, selectedUsers]);

  // Add user to selected list
  const handleAddUser = (user) => {
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Remove user from selected list
  const handleRemoveUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== userId)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDuty = {
      date: new Date(date),
      shift,
      users: selectedUsers.map((user) => ({ id: user.id })), // Make sure the users are passed by id
    };

    const res = await fetch(`/api/firefightingduty/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDuty),
    });
    console.log(updatedDuty)
    if (res.ok) {
      router.push('/security-services/firefighting-duty');
    } else {
      alert('Error updating duty');
    }
  };

  if (!duty || !allUsers) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-6">Edit Firefighting Duty</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shift</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Users</label>
            <div className="space-y-2">
              {/* Dropdown to add users */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-gray-200 text-sm rounded-md w-full sm:w-auto"
              >
                Select Users
              </button>
              {isDropdownOpen && (
                <div className="absolute bg-white border border-gray-300 mt-2 w-full sm:max-w-lg p-2 rounded-md shadow-lg max-h-60 overflow-auto z-10">
                  <ul className="space-y-2">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <li
                          key={user.id}
                          className="flex justify-between items-center p-2 border border-gray-300 rounded-md"
                        >
                          <span>{user.name}</span>
                          <button
                            type="button"
                            onClick={() => handleAddUser(user)}
                            className="text-blue-500 text-sm font-medium"
                          >
                            Add
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No users available</li>
                    )}
                  </ul>
                </div>
              )}

              {/* List of selected users */}
              <div>
                <h3 className="text-sm font-medium text-gray-700">Selected Users</h3>
                <ul className="space-y-2">
                  {selectedUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex justify-between items-center p-2 border border-gray-300 rounded-md"
                    >
                      <span>{user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-500 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
          >
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditFirefightingDuty;
