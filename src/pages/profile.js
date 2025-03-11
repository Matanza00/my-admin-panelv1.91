import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar'; // Adjust the path if necessary
import Sidebar from '../components/sidebar'; // Adjust the path if necessary

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      console.log('Fetching profile for user ID:', session.user.id);

      // Fetch user profile data using the user ID
      fetch(`/api/profile?id=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Profile data received:', data);
          if (data.user) {
            setUserData(data.user);
          } else {
            console.error('Error in data:', data.error);
          }
        })
        .catch((err) => console.error('Error fetching profile:', err));
    }
  }, [session]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-bold">You must be signed in to view this page.</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col w-full">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-6">Profile Information</h1>
            {userData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <p>
                    <span className="font-semibold">Name:</span> {userData.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {userData.email || 'Not Available'}
                  </p>
                  <p>
                    <span className="font-semibold">Username:</span> {userData.username}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <p>
                    <span className="font-semibold">Role:</span> {userData.role?.name || 'Not Assigned'}
                  </p>
                  <p>
                    <span className="font-semibold">Department:</span>{' '}
                    {userData.department?.name || 'Not Assigned'}
                  </p>
                  <p>
                    <span className="font-semibold">Joined On:</span>{' '}
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center mt-4">Loading profile details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
