import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

export default function ViewJanitorialAttendance() {
  const [attendance, setAttendance] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const fetchAttendanceData = async () => {
    const res = await fetch(`/api/janitorial-attendance/${id}`);
    const data = await res.json();
    setAttendance(data);
  };
  useEffect(() => {
    if (id) {
      fetchAttendanceData();
    }
  }, [id]);


  // Handle back navigation
  const handleBack = () => {
    router.back(); // Go back to the previous page
  };


  if (!attendance) return <div>Loading...</div>;

  return (<Layout>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Janitorial Attendance Details</h1>
              {/* Back Button */}
              <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Supervisor: {attendance.supervisorName}</h2>
        <p className="text-lg text-gray-600">Presence Strength: {attendance.strength}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Absences</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Janitor Name</th>
            <th className="py-2 px-4 border-b text-left">Absent</th>
          </tr>
        </thead>
        <tbody>
          {attendance.janitorAbsences.map((absence) => (
            <tr key={absence.id}>
              <td className="py-2 px-4 border-b">{absence.name}</td>
              <td className="py-2 px-4 border-b">{absence.isAbsent ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <button
          onClick={() => router.push(`/janitorial/attendance/edit/${id}`)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Edit Attendance
        </button>
      </div>
    </div></Layout>
  );
}
