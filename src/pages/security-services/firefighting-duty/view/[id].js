import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const ViewFirefightingDuty = () => {
  const [duty, setDuty] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // Debugging: Log the `id`
  console.log('Router ID:', id);

  useEffect(() => {
    if (id) {
      console.log('Fetching duty with ID:', id); // Log the ID
      fetch(`/api/firefightingduty/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched Data:', data);  // Log the response
          setDuty(data);
        })
        .catch((err) => console.error('Error fetching duty details:', err));
    }
  }, [id]);

  // Check if duty is set
  // console.log('Duty:', duty);

  if (!duty) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-6">Firefighting Duty Details</h1>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">Date</h3>
            <p className="text-gray-600">{duty.date}</p>
          </div>

          <div>
            <h3 className="text-xl font-medium">Shift</h3>
            <p className="text-gray-600">{duty.shift}</p>
          </div>

          <div>
            <h3 className="text-xl font-medium">Users</h3>
            <ul className="space-y-2">
              {duty.users && duty.users.length > 0 ? (
                duty.users.map((user) => (
                  <li key={user.id} className="p-2 border border-gray-300 rounded-md">
                    {user.name}
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No users assigned</p>
              )}
            </ul>
          </div>

          <button
            onClick={() => router.push(`/security-services/firefighting-duty/edit/${id}`)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Duty
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ViewFirefightingDuty;
