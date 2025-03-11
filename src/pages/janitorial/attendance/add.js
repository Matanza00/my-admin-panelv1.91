import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiX } from 'react-icons/hi';
import Layout from '../../../components/layout';

export default function AddJanitorialAttendance() {
  const [supervisor, setSupervisor] = useState('');
  const [supervisorsList, setSupervisorsList] = useState([]); // Supervisors list
  const [absences, setAbsences] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch supervisors and technicians
    const fetchSupervisors = async () => {
      try {
        const res = await fetch('/api/users/filtered?roles=Supervisor&departments=Janitorial');
        if (res.ok) {
          const data = await res.json();
          setSupervisorsList(data);
        } else {
          console.error('Failed to fetch supervisors');
        }
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const res = await fetch('/api/users/filtered?roles=Technician&departments=Janitorial');
        if (res.ok) {
          const data = await res.json();
          // Populate absences with technicians as present by default
          setAbsences(data.map((tech) => ({ name: tech.name, isAbsent: false })));
        } else {
          console.error('Failed to fetch technicians');
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchSupervisors();
    fetchTechnicians();
  }, []);

  const handleAbsenceChange = (index, e) => {
    const { name, checked } = e.target;
    const updatedAbsences = [...absences];
    updatedAbsences[index][name] = checked; // Update absence status
    setAbsences(updatedAbsences);
  };

  const addAbsenceField = () => {
    setAbsences([...absences, { name: '', isAbsent: true }]);
  };

  const removeAbsenceField = (index) => {
    const updatedAbsences = absences.filter((_, i) => i !== index);
    setAbsences(updatedAbsences);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculate the presence strength
    const presenceStrength = absences.filter((absence) => !absence.isAbsent).length;

    const newAttendance = {
      supervisor,
      strength: presenceStrength, // Use calculated strength
      absences,
      remarks,
    };

    const res = await fetch(`/api/janitorial-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAttendance),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/janitorial/attendance/view/${data.id}`);
    } else {
      alert('Error creating attendance');
    }

    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate the presence strength dynamically
  const presenceStrength = absences.filter((absence) => !absence.isAbsent).length;

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Add Janitorial Attendance</h1>
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
              {supervisorsList.map((sup) => (
                <option key={sup.id} value={sup.name}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700">Presence Strength</label>
            <input
              type="number"
              value={presenceStrength}
              readOnly
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
      readOnly={!absence.name} // Disable editing for fetched technicians
      onChange={(e) => handleAbsenceChange(index, e)}
      placeholder="Janitor Name"
      className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
    />
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`isAbsent-${index}`}
        name="isAbsent"
        checked={absence.isAbsent}
        onChange={(e) => handleAbsenceChange(index, e)}
        className="hidden"
      />
      <label
        htmlFor={`isAbsent-${index}`}
        className={`cursor-pointer mr-2 ${
          absence.isAbsent ? 'text-red-600 font-semibold' : 'text-gray-700'
        }`}
      >
        Absent
      </label>
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

          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              placeholder="Enter any remarks"
            />
          </div>

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
