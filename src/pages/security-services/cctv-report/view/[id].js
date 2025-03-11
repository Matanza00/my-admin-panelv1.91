import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

export default function ViewCCTVRecord() {
  const router = useRouter();
  const { id } = router.query;
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchRecord = async () => {
        try {
          const response = await fetch(`/api/cctv-report/${id}`); // Ensure the API endpoint is correct
          if (!response.ok) throw new Error('Failed to fetch record');
          const data = await response.json();
          setRecord(data);
        } catch (error) {
          console.error('Error fetching record:', error);
        }
      };
      fetchRecord();
    }
  }, [id]);

  if (!record) return <p>Loading...</p>;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">View CCTV Record</h1>
        <div className="p-6 border rounded-lg shadow bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <p>
              <strong>Date:</strong> {formatDate(record.date)}
            </p>
            <p>
              <strong>Time:</strong> {formatTime(record.time)}
            </p>
            <p>
              <strong>Operator:</strong> {record.cctvOperatorName || 'Unknown'}
            </p>
            <p>
              <strong>Operational Report:</strong> {record.operationalReport ? 'Yes' : 'No'}
            </p>
          </div>
          <p>
            <strong>Remarks:</strong> {record.remarks || 'No remarks available'}
          </p>

          {/* Cameras Section */}
          {record.camera?.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold mt-6 mb-4">Cameras</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Camera Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Camera No</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.camera.map((camera, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{camera.cameraType || 'Unknown'}</td>
                        <td className="border border-gray-300 px-4 py-2">{camera.cameraName || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{camera.cameraNo || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{camera.cameraLocation || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="mt-4 text-center text-gray-600">No cameras associated with this record.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
