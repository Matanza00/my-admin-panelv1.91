import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import { GENERATORS } from '../../../constant'; // Import the constant

export default function AddGenerator() {
  const [generator, setGenerator] = useState({
    genSetNo: '',
    power: '',
    capacity: 0,
    currHrs: 0,
    currDate: '',
    lastHrs: 0,
    lastDate: '',
    electricianName: '',
    supervisorName: '',
    engineerName: '',
  });
  const [fuelDetails, setFuelDetails] = useState([
    { fuelLast: 0, fuelConsumed: 0, fuelReceived: 0, available: 0 },
  ]);
  const [electricians, setElectricians] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch the previous generator entry to get lastHrs and lastDate
  useEffect(() => {
    const fetchLastGeneratorData = async () => {
      const response = await fetch('/api/generator/last');
      if (response.ok) {
        const lastGenerator = await response.json();
        if (lastGenerator) {
          setGenerator((prev) => ({
            ...prev,
            lastHrs: lastGenerator.lastHrs || 0,
            lastDate: lastGenerator.lastDate || '',
          }));
        }
      }
    };

    fetchLastGeneratorData();
  }, []);

  // Fetch the previous generator entry to get lastHrs and lastDate
  useEffect(() => {
    const fetchLastGeneratorData = async () => {
      const response = await fetch('/api/generator/last');
      if (response.ok) {
        const lastGenerator = await response.json();
        if (lastGenerator) {
          setGenerator((prev) => ({
            ...prev,
            lastHrs: lastGenerator.lastHrs || 0,
            lastDate: lastGenerator.lastDate || '',
          }));
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const [electricianRes, engineerRes] = await Promise.all([
          fetch('/api/users/filtered?roles=Technician&departments=Electrical'),
          fetch('/api/users/filtered?roles=Supervisor&departments=Electrical'),
        ]);

        const electriciansData = await electricianRes.json();
        const engineersData = await engineerRes.json();

        setElectricians(electriciansData);
        setEngineers(engineersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchLastGeneratorData();
    fetchUsers();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenerator((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Gen Set Number selection
  const handleGenSetSelection = (e) => {
    const selectedGenSet = GENERATORS.find(
      (gen) => gen.genSetNo === e.target.value
    );
  
    console.log("Selected Generator:", selectedGenSet); // Debugging
  
    if (selectedGenSet) {
      setGenerator((prev) => ({
        ...prev,
        genSetNo: selectedGenSet.genSetNo,
        power: selectedGenSet.power,
        capacity: selectedGenSet.fuelCapacity, // Update the capacity here
      }));
    }
  };
  

  const handleFuelChange = (index, field, value) => {
    setFuelDetails((prev) =>
      prev.map((fuel, i) => {
        if (i === index) {
          const updatedFuel = { ...fuel, [field]: value };

          // Calculate `Available`
          updatedFuel.available =
            (parseFloat(updatedFuel.fuelLast) || 0) +
            (parseFloat(updatedFuel.fuelReceived) || 0) -
            (parseFloat(updatedFuel.fuelConsumed) || 0);

          return updatedFuel;
        }
        return fuel;
      })
    );
  };

  const addFuelDetail = () => {
    setFuelDetails((prev) => [
      ...prev,
      { fuelLast: 0, fuelConsumed: 0, fuelReceived: 0, available: 0 },
    ]);
  };

  const removeFuelDetail = (index) => {
    setFuelDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedGenerator = {
      ...generator,
      date: new Date(generator.date),
      currDate: new Date(generator.currDate),
      lastDate: generator.lastDate ? new Date(generator.lastDate) : null,
      generatorFuel: fuelDetails,
    };

    const response = await fetch('/api/generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updatedGenerator, createdById: userId }), // Include createdById
    });

    if (response.ok) {
      alert('Generator added successfully!');
      router.push(`/daily-maintenance/generator`);
    } else {
      alert('Error adding generator.');
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Generator Set Number</label>
              <select
                name="genSetNo"
                value={generator.genSetNo}
                onChange={handleGenSetSelection}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                required
              >
                <option value="">Select Generator Set</option>
                {GENERATORS.map((gen) => (
                  <option key={gen.genSetNo} value={gen.genSetNo}>
                    {gen.genSetNo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Power</label>
              <input
                type="text"
                name="power"
                value={generator.power}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                disabled
              />
            </div>
            <div>
              <label className="block mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={generator.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                disabled // Make it disabled since it's auto-populated
              />
            </div>

            <div>
              <label className="block mb-2">Current Hours</label>
              <input
                type="number"
                name="currHrs"
                value={generator.currHrs}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Current Date</label>
              <input
                type="date"
                name="currDate"
                value={generator.currDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Last Hours</label>
              <input
                type="number"
                name="lastHrs"
                value={generator.lastHrs}
                disabled
                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Last Date</label>
              <input
                type="date"
                name="lastDate"
                value={generator.lastDate}
                disabled
                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold mt-4">Fuel Details</h3>
          {fuelDetails.map((fuel, index) => (
            <div
              key={index}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center mb-4"
            >
              <div>
                <label className="block mb-2">Fuel Last</label>
                <input
                  type="number"
                  value={fuel.fuelLast}
                  onChange={(e) =>
                    handleFuelChange(index, 'fuelLast', parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block mb-2">Fuel Consumed</label>
                <input
                  type="number"
                  value={fuel.fuelConsumed}
                  onChange={(e) =>
                    handleFuelChange(index, 'fuelConsumed', parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block mb-2">Fuel Received</label>
                <input
                  type="number"
                  value={fuel.fuelReceived}
                  onChange={(e) =>
                    handleFuelChange(index, 'fuelReceived', parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block mb-2">Available</label>
                <input
                  type="number"
                  value={fuel.available}
                  disabled
                  className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFuelDetail(index)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFuelDetail}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
          >
            Add Fuel Detail
          </button>

          <div>
              <label className="block mb-2">Electrician</label>
              <select
                name="electricianId"
                value={generator.electricianId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                required
              >
                <option value="">Select Electrician</option>
                {electricians.map((electrician) => (
                  <option key={electrician.id} value={electrician.id}>
                    {electrician.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Supervisor</label>
              <select
                name="engineerId"
                value={generator.engineerId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                required
              >
                <option value="">Select Supervisor</option>
                {engineers.map((engineer) => (
                  <option key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
          

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 font-bold rounded-md ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? 'Saving...' : 'Save Generator'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
