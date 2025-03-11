import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';

const AddFirefightingDuty = () => {
  const [shift, setShift] = useState('');
  const [date, setDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Fetch available employees from both firefightingalarm and firefighting
  useEffect(() => {
    Promise.all([
      fetch('/api/users/filtered?departments=firefightingalarm'),
      fetch('/api/users/filtered?departments=firefighting')
    ])
      .then(([firefightingAlarmRes, firefightingRes]) => 
        Promise.all([firefightingAlarmRes.json(), firefightingRes.json()])
      )
      .then(([firefightingAlarmData, firefightingData]) => {
        // Merge and remove duplicates based on user ID
        const mergedUsers = Array.from(
          new Map([...firefightingAlarmData, ...firefightingData].map(user => [user.id, user])).values()
        );
  
        console.log('Fetched merged users:', mergedUsers); // Debugging log
        setAllUsers(mergedUsers);
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, []);
  

  // Update filtered users based on selected users
  useEffect(() => {
    // Filter out selected users
    const filtered = allUsers.filter(
      (user) => !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
    );
    setFilteredUsers(filtered);
  }, [allUsers, selectedUsers]);

  // Handle user search
  const handleSearch = (e) => {
    const query = e.target.value;
    setUserSearch(query);

    // Filter the users by name while excluding selected users
    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
    );

    console.log('Filtered users:', filtered); // Debugging log
    setFilteredUsers(filtered);
  };

  // Add user to selected users
  const handleAddUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setUserSearch('');
    setIsDropdownOpen(false);
  };

  // Remove user from selected list
  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newDuty = {
      date: new Date(date),
      shift,
      users: selectedUsers.map((user) => ({ id: user.id })),
    };

    const res = await fetch('/api/firefightingduty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newDuty, createdById: userId }), // Include createdById
    });
    console.log(newDuty)
    if (res.ok) {
      router.push('/security-services/firefighting-duty');
    } else {
      alert('Error adding duty');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-6">Add Firefighting Duty</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date.split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Shift selection */}
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

          {/* Users selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Users</label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={handleSearch}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                {isDropdownOpen && Array.isArray(filteredUsers) && filteredUsers.length > 0 && (
                  <div className="absolute right-2 top-8 z-10 bg-white shadow-lg max-h-48 overflow-y-auto w-full rounded-md">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddUser(user)}
                      >
                        {user.name} ({user.department?.name || 'No Department'})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Display selected users */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Duty
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddFirefightingDuty;
