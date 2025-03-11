import { useState, useEffect } from 'react';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';

const AddBoilerForm = () => {
  const [formData, setFormData] = useState({
    StartTime: '',
    ShutdownTime: '',
    Remarks: '',
    OperatorName: '',
    SupervisorName: '',
    EngineerName: '',
    TimeHr: [],
  });
  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch technicians
        const technicianRes = await fetch(
          "/api/users/filtered?roles=Technician&departments=HVAC"
        );
        const technicianData = await technicianRes.json();
        setTechnicians(technicianData);

        // Fetch supervisors
        const supervisorRes = await fetch(
          "/api/users/filtered?roles=Supervisor&departments=HVAC"
        );
        const supervisorData = await supervisorRes.json();
        setSupervisors(supervisorData);
      } catch (error) {
        console.error("Error fetching Technicians or Supervisors:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTimeHrChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTimeHr = [...formData.TimeHr];
    updatedTimeHr[index][name] = value;
    setFormData((prevData) => ({ ...prevData, TimeHr: updatedTimeHr }));
  };

  const handleAddTimeHr = () => {
    setFormData((prevData) => ({
      ...prevData,
      TimeHr: [
        ...prevData.TimeHr,
        { HotWaterIn: '', HotWaterOut: '', ExhaustTemp: '', FurnacePressure: '', assistantSupervisor: '' },
      ],
    }));
  };

  const handleDeleteTimeHr = (index) => {
    const updatedTimeHr = formData.TimeHr.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, TimeHr: updatedTimeHr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/hot-water-boiler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, createdById: userId }), // Include createdById
    });
    if (response.ok) {
      alert('Boiler added!');
      router.push(`/daily-maintenance/hot-water-boiler`);
    } else {
      alert('Failed to add boiler');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-semibold mb-6">Add Hot Water Boiler</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input fields for StartTime and ShutdownTime */}
          {['StartTime', 'ShutdownTime'].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-white mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="datetime-local"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-800 text-white"
                required
              />
            </div>
          ))}

          {/* Remarks */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Remarks</label>
            <textarea
              name="Remarks"
              value={formData.Remarks}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
            />
          </div>

          {/* Operator Name Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Operator Name</label>
            <select
              name="OperatorName"
              value={formData.OperatorName}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
            >
              <option value="">Select Operator</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>

          {/* Supervisor Name Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Supervisor Name</label>
            <select
              name="SupervisorName"
              value={formData.SupervisorName}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
            >
              <option value="">Select Supervisor</option>
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Hours */}
          <div className="mb-4">
            <h3 className="text-white mb-2">Time Hours</h3>
            {formData.TimeHr.map((entry, index) => (
              <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                {['HotWaterIn', 'HotWaterOut', 'ExhaustTemp', 'FurnacePressure', 'assistantSupervisor'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    name={field}
                    value={entry[field]}
                    onChange={(e) => handleTimeHrChange(e, index)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => handleDeleteTimeHr(index)}
                  className="px-3 py-2 bg-red-600 rounded-md text-white"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTimeHr}
              className="px-4 py-2 bg-green-600 rounded-md text-white w-full"
            >
              Add New TimeHr Entry
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Add Boiler
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddBoilerForm;
