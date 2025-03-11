import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditBoilerForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    StartTime: '',
    ShutdownTime: '',
    Remarks: '',
    OperatorName: '',
    SupervisorName: '',
    Chillers: [],
  });

  const [operators, setOperators] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchBoilerData = async () => {
      try {
        const response = await fetch(`/api/absorptionchiller/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            StartTime: new Date(data.StartTime).toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16),
            ShutdownTime: new Date(data.ShutdownTime).toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16),

            Remarks: data.Remarks || '',
            OperatorName: data.OperatorName || '',
            SupervisorName: data.SupervisorName || '',
            Chillers: data.Chillers.map((chiller) => {
              const date = new Date(chiller.time);

return {
  ...chiller,
  time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) // Local time in HH:MM format
};

            }) || [],
          });
        } else {
          alert('Error fetching chiller data');
        }
      } catch (error) {
        console.error('Error fetching chiller data:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const operatorResponse = await fetch(
          '/api/users/filtered?roles=Technician&departments=HVAC'
        );
        const supervisorResponse = await fetch(
          '/api/users/filtered?roles=Supervisor&departments=HVAC'
        );

        if (operatorResponse.ok) setOperators(await operatorResponse.json());
        if (supervisorResponse.ok) setSupervisors(await supervisorResponse.json());
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchBoilerData();
    fetchUsers();
  }, [id]);
console.log("form",formData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChillerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChillers = [...formData.Chillers];
    updatedChillers[index] = { ...updatedChillers[index], [name]: value };
    setFormData({ ...formData, Chillers: updatedChillers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/absorptionchiller/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Chiller updated successfully');
        router.push(`/daily-maintenance/absorptionchiller/view/${id}`);
      } else {
        alert('Error updating chiller');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addChiller = () => {
    setFormData({
      ...formData,
      Chillers: [
        ...formData.Chillers,
        {
          time: '',
          ColdWaterIn: 0,
          ColdWaterOut: 0,
          ChillingWaterIn: 0,
          ChillingWaterOut: 0,
          HeatIn: 0,
          HeatOut: 0,
          assistantSupervisor: '',
        },
      ],
    });
  };

  const deleteChiller = (index) => {
    if (window.confirm('Are you sure you want to delete this chiller entry?')) {
      const updatedChillers = formData.Chillers.filter((_, i) => i !== index);
      setFormData({ ...formData, Chillers: updatedChillers });
    }
  };

  console.log(formData)
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Edit Absorption/DFA Chiller</h1>
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Chiller Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="StartTime" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="StartTime"
                  name="StartTime"
                  value={formData.StartTime}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="ShutdownTime" className="block text-sm font-medium text-gray-700">
                  Shutdown Time
                </label>
                <input
                  type="datetime-local"
                  id="ShutdownTime"
                  name="ShutdownTime"
                  value={formData.ShutdownTime}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="Remarks" className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  id="Remarks"
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="OperatorName" className="block text-sm font-medium text-gray-700">
                  Operator Name
                </label>
                <select
                  id="OperatorName"
                  name="OperatorName"
                  value={formData.OperatorName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="" disabled>
                    Select Operator
                  </option>
                  {operators.map((operator) => (
                    <option key={operator.id} value={operator.name}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="SupervisorName" className="block text-sm font-medium text-gray-700">
                  Supervisor Name
                </label>
                <select
                  id="SupervisorName"
                  name="SupervisorName"
                  value={formData.SupervisorName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="" disabled>
                    Select Supervisor
                  </option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.name}>
                      {supervisor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chiller Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Chiller Information</h2>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Time</th>
                  <th className="border border-gray-300 px-4 py-2">Cold Water In</th>
                  <th className="border border-gray-300 px-4 py-2">Cold Water Out</th>
                  <th className="border border-gray-300 px-4 py-2">Chilling Water In</th>
                  <th className="border border-gray-300 px-4 py-2">Chilling Water Out</th>
                  <th className="border border-gray-300 px-4 py-2">Heat In</th>
                  <th className="border border-gray-300 px-4 py-2">Heat Out</th>
                  <th className="border border-gray-300 px-4 py-2">Assistant Supervisor</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.Chillers.map((chiller, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="time"
                        name="time"
                        value={chiller.time}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="ColdWaterIn"
                        value={chiller.ColdWaterIn}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="ColdWaterOut"
                        value={chiller.ColdWaterOut}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="ChillingWaterIn"
                        value={chiller.ChillingWaterIn}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="ChillingWaterOut"
                        value={chiller.ChillingWaterOut}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="HeatIn"
                        value={chiller.HeatIn}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="HeatOut"
                        value={chiller.HeatOut}
                        onChange={(e) => handleChillerChange(index, e)}
                        required
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="assistantSupervisor"
                        value={chiller.assistantSupervisor}
                        onChange={(e) => handleChillerChange(index, e)}
                        className="w-full"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteChiller(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={addChiller}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Chiller
            </button>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Absorption Chiller
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditBoilerForm;
