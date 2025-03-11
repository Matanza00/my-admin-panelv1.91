import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import pumpsAndTanks from '../../../constant'; // Assuming pumpsAndTanks contains pump data

const AddWaterManagement = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [operators, setOperators] = useState([]);
  const [pumps, setPumps] = useState([]);
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

  // Fetch dropdown data for supervisors and operators
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [supervisorRes, operatorRes] = await Promise.all([
          
          fetch(
            '/api/users/filtered?roles=Supervisor&departments=Building'
          ),
          fetch(
            '/api/users/filtered?roles=Technician&departments=Plumbing'
          ),
          ,
        ]);

        if (supervisorRes.ok && operatorRes.ok) {
          const supervisorData = await supervisorRes.json();
          const operatorData = await operatorRes.json();
          setSupervisors(supervisorData || []);
          setOperators(operatorData || []);
        } else {
          console.error('Failed to fetch dropdown data');
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Handle adding a new pump
  const handleAddPump = () => {
    const newPump = {
      name: '',
      capacity: '',
      location: '',
      checks: [
        {
          waterSeal: '',
          pumpBearing: '',
          motorBearing: '',
          rubberCoupling: '',
          pumpImpeller: '',
          mainValves: '',
          motorWinding: '',
        },
      ],
    };
    setPumps([...pumps, newPump]);
  };

  // Handle updating a pump's details
  const handleUpdatePump = (index, field, value, checkIndex = null, checkField = null) => {
    setPumps((prevPumps) => {
      const updatedPumps = [...prevPumps];

      if (checkIndex !== null && checkField) {
        // Update specific check field
        const updatedChecks = [...updatedPumps[index].checks];
        updatedChecks[checkIndex] = { ...updatedChecks[checkIndex], [checkField]: value };
        updatedPumps[index].checks = updatedChecks;
      } else {
        // Update pump-level field
        updatedPumps[index] = { ...updatedPumps[index], [field]: value };

        if (field === 'name') {
          const selectedPump = pumpsAndTanks.find((pump) => pump.name === value);
          if (selectedPump) {
            updatedPumps[index].capacity = selectedPump.capacity;
            updatedPumps[index].location = selectedPump.location;
          } else {
            updatedPumps[index].capacity = '';
            updatedPumps[index].location = '';
          }
        }
      }

      return updatedPumps;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      supervisorId,
      operatorId,
      pumps,
    };

    try {
      const response = await fetch(`/api/water-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, createdById: userId }), // Include createdById
      });

      if (response.ok) {
        alert('Water management added successfully');
        setTitle('');
        setDescription('');
        setSupervisorId('');
        setOperatorId('');
        setPumps([]);
        router.push('/daily-maintenance/water-management');
      } else {
        const errorData = await response.json();
        console.error('Error adding water management:', errorData.error);
        alert('Failed to add: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error adding water management:', error);
      alert('Failed to add: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Add Water Management</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Water Management Details */}
          <div className="bg-gray-800 p-4 rounded-md space-y-4">
            <div className="flex flex-col">
              <label className="text-white font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-white font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-white font-semibold mb-1">Supervisor</label>
              <select
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="p-2 rounded-md bg-gray-700 text-white"
                required
              >
                <option value="">Select Supervisor</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-white font-semibold mb-1">Operator</label>
              <select
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="p-2 rounded-md bg-gray-700 text-white"
                required
              >
                <option value="">Select Operator</option>
                {operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pumps Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Pumps</h2>
            {pumps.map((pump, pumpIndex) => (
              <div key={pumpIndex} className="bg-gray-800 p-4 rounded-md space-y-4">
                <h3 className="text-white font-semibold">Pump {pumpIndex + 1}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-1">Pump Name</label>
                    <select
                      className="p-2 rounded-md bg-gray-700 text-white w-full"
                      value={pump.name}
                      onChange={(e) => handleUpdatePump(pumpIndex, 'name', e.target.value)}
                    >
                      <option value="">Select Pump</option>
                      {pumpsAndTanks.map((pumpOption) => (
                        <option key={pumpOption.name} value={pumpOption.name}>
                          {pumpOption.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-1">Capacity</label>
                    <input
                      type="text"
                      value={pump.capacity}
                      readOnly
                      className="p-2 rounded-md bg-gray-700 text-white w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-1">Location</label>
                    <input
                      type="text"
                      value={pump.location}
                      readOnly
                      className="p-2 rounded-md bg-gray-700 text-white w-full"
                    />
                  </div>
                </div>

                {/* Pump Checks */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {pump.checks.map((check, checkIndex) =>
                    Object.entries(check)
                      .filter(([key]) => key !== 'id')
                      .map(([key, value]) => (
                        <div key={`${key}-${checkIndex}`}>
                          <label className="text-white font-semibold mb-1">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <select
                            value={value || ''}
                            onChange={(e) =>
                              handleUpdatePump(pumpIndex, 'checks', e.target.value, checkIndex, key)
                            }
                            className="p-2 rounded-md bg-gray-700 text-white w-full"
                          >
                            <option value="">Select {key.replace(/([A-Z])/g, ' $1')}</option>
                            <option value="Working">Working</option>
                            <option value="Noisy">Noisy</option>
                            <option value="Damaged">Damaged</option>
                          </select>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPump}
              className="p-2 bg-green-600 text-white rounded-md w-full hover:bg-green-700"
            >
              Add New Pump
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700"
          >
            Add Water Management
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddWaterManagement;
