import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiX } from 'react-icons/hi';
import Layout from '../../../../components/layout';

export default function EditJanitorialAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [supervisor, setSupervisor] = useState('');
  const [supervisors, setSupervisors] = useState([]); // Supervisor dropdown options
  const [strength, setStrength] = useState('');
  const [absences, setAbsences] = useState([{ name: '', isAbsent: true }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  // Fetch attendance data
  useEffect(() => {
    if (id) {
      fetchAttendanceData();
      fetchSupervisors();
    }
  }, [id]);

  // Fetch all supervisors for the dropdown
  const fetchSupervisors = async () => {
    const res = await fetch('/api/users/filtered?roles=supervisor&departments=janitorial');
    const data = await res.json();
    setSupervisors(data || []);
  };

  const fetchAttendanceData = async () => {
    const res = await fetch(`/api/janitorial-attendance/${id}`);
    const data = await res.json();
    setAttendance(data);
    setSupervisor(data.supervisor); // Prefill supervisor ID
    setStrength(data.strength);
    setAbsences(
      data.janitorAbsences.map((absence) => ({
        name: absence.name,
        isAbsent: absence.isAbsent,
      }))
    );
  };

  // Function to recalculate strength
// Function to dynamically recalculate strength
const recalculateStrength = (updatedAbsences) => {
  const totalJanitors = updatedAbsences.length; // Total people in the list
  const absentCount = updatedAbsences.filter((a) => a.isAbsent).length;
  const newStrength = Math.max(totalJanitors - absentCount, 0); // Ensure strength never goes negative

  setStrength(newStrength);
};

// Handle changes in absence list
const handleAbsenceChange = (index, e) => {
  const { name, value, type, checked } = e.target;
  const updatedAbsences = [...absences];

  if (type === 'checkbox') {
    updatedAbsences[index][name] = checked;
  } else {
    updatedAbsences[index][name] = value;
  }

  setAbsences(updatedAbsences);
  recalculateStrength(updatedAbsences);
};

// Add a new absence field and update strength
const addAbsenceField = () => {
  const updatedAbsences = [...absences, { name: '', isAbsent: true }];
  setAbsences(updatedAbsences);
  recalculateStrength(updatedAbsences);
};

// Remove an absence field and update strength
const removeAbsenceField = (index) => {
  const updatedAbsences = absences.filter((_, i) => i !== index);
  setAbsences(updatedAbsences);
  recalculateStrength(updatedAbsences);
};

// Run recalculation when attendance data is loaded
useEffect(() => {
  if (attendance) {
    setAbsences(attendance.janitorAbsences);
    recalculateStrength(attendance.janitorAbsences);
  }
}, [attendance]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedAttendance = {
      supervisor,
      strength: parseInt(strength),
      absences,
    };

    const res = await fetch(`/api/janitorial-attendance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAttendance),
    });

    if (res.ok) {
      router.push(`/janitorial/attendance/view/${id}`);
    } else {
      alert('Error updating attendance');
    }

    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  if (!attendance) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Edit Janitorial Attendance</h1>
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700">Supervisor</label>
            <select
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
            >
              <option value="">Select Supervisor</option>
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700">Presence Strength</label>
            <input
              type="number"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Absences</h2>
          {absences.map((absence, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <input
                type="text"
                name="name"
                value={absence.name}
                onChange={(e) => handleAbsenceChange(index, e)}
                placeholder="Janitor Name"
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAbsent"
                  checked={absence.isAbsent}
                  onChange={(e) => handleAbsenceChange(index, e)}
                  className="mr-2"
                />
                Absent
              </div>
              <button
                type="button"
                onClick={() => removeAbsenceField(index)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                <HiX />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addAbsenceField}
            className="mb-4 bg-blue-600 text-white p-3 rounded-lg"
          >
            Add Absence
          </button>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
