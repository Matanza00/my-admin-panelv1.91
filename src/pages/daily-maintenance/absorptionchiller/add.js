import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/layout';

const AddChillerForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    StartTime: '',
    ShutdownTime: '',
    Remarks: '',
    OperatorName: '',
    SupervisorName: '',
    Chillers: [],
  });

  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [isSubmitting] = useState(false);
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
    // Fetch technicians and supervisors
    const fetchUserData = async () => {
      try {
        const technicianResponse = await fetch(
          '/api/users/filtered?roles=Technician&departments=HVAC'
        );
        const supervisorResponse = await fetch(
          '/api/users/filtered?roles=Supervisor&departments=HVAC'
        );
        if (technicianResponse.ok) setTechnicians(await technicianResponse.json());
        if (supervisorResponse.ok) setSupervisors(await supervisorResponse.json());
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChillerChange = (e, index) => {
    const { name, value } = e.target;
    const updatedChillers = [...formData.Chillers];
    updatedChillers[index][name] = value;
    setFormData((prev) => ({ ...prev, Chillers: updatedChillers }));
  };

  const handleAddChiller = () => {
    setFormData((prev) => ({
      ...prev,
      Chillers: [
        ...prev.Chillers,
        { ColdWaterIn: '', ColdWaterOut: '', ChillingWaterIn: '', ChillingWaterOut: '', HeatIn: '', HeatOut: '', assistantSupervisor: '' },
      ],
    }));
  };

  const handleDeleteChiller = (index) => {
    const updatedChillers = formData.Chillers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, Chillers: updatedChillers }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Correct the keys to match the API expectations
    const payload = {
      startTime: formData.StartTime,
      shutdownTime: formData.ShutdownTime,
      remarks: formData.Remarks,
      operatorName: formData.OperatorName,
      supervisorName: formData.SupervisorName,
      chillerData: formData.Chillers.map((chiller) => ({
        ColdWaterIn: chiller.ColdWaterIn,
        ColdWaterOut: chiller.ColdWaterOut,
        ChillingWaterIn: chiller.ChillingWaterIn,
        ChillingWaterOut: chiller.ChillingWaterOut,
        HeatIn: chiller.HeatIn,
        HeatOut: chiller.HeatOut,
        assistantSupervisor: chiller.assistantSupervisor,
      })),
    };
  
    console.log('Payload:', payload); // Log the corrected payload for debugging
  
    const response = await fetch('/api/absorptionchiller', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, createdById: userId }), // Include createdById
    });
  
    if (response.ok) {
      alert('Chiller added successfully!');
      router.push('/daily-maintenance/absorptionchiller');
    } else {
      const errorData = await response.json();
      console.error('Error response:', errorData); // Log the error details for debugging
      alert(`Failed to add chiller: ${errorData.error}`);
    }
  };
  

  console.log(formData)
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-semibold mb-6">Add Absorption / DFA Chiller</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex flex-col">
            <label className="text-white mb-1">Operator Name</label>
            <select
              name="OperatorName"
              value={formData.OperatorName}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            >
              <option value="">Select Operator</option>
              {technicians.length === 0 && <option value="">Loading...</option>}
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-1">Supervisor Name</label>
            <select
              name="SupervisorName"
              value={formData.SupervisorName}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            >
              <option value="">Select Supervisor</option>
              {supervisors.length === 0 && <option value="">Loading...</option>}
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
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
          <div className="mb-4">
            <h3 className="text-white mb-2">Chiller Entries</h3>
            {formData.Chillers.map((entry, index) => (
              <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                {['ColdWaterIn', 'ColdWaterOut', 'ChillingWaterIn', 'ChillingWaterOut', 'HeatIn', 'HeatOut','assistantSupervisor'].map(
                  (field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field}
                      name={field}
                      value={entry[field]}
                      onChange={(e) => handleChillerChange(e, index)}
                      className="px-3 py-2 rounded-md bg-gray-700 text-white"
                    />
                  )
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteChiller(index)}
                  className="px-3 py-2 bg-red-600 rounded-md text-white"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddChiller}
              className="px-4 py-2 bg-green-600 rounded-md text-white w-full"
            >
              Add New  Entry
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Chiller'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddChillerForm;
