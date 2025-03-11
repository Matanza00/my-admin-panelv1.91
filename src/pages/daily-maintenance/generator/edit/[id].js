import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

export default function EditGenerator() {
  const [generator, setGenerator] = useState({
    genSetNo: '',
    power: '',
    capacity: 0,
    currHrs: 0,
    currDate: '',
    lastHrs: 0,
    lastDate: '',
    electricianId: '',
    engineerId: '',
  });
  const [electricians, setElectricians] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [fuelDetails, setFuelDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchGeneratorData = async (electriciansData, engineersData) => {
      if (!id) return;
  
      try {
        const response = await fetch(`/api/generator/${id}`);
        if (response.ok) {
          const data = await response.json();
  
          // Find the IDs for the stored names in the dropdown options
          const electricianMatch = electriciansData.find((el) => el.name === data.electricianName);
          const engineerMatch = engineersData.find((en) => en.name === data.engineerName);
  
          setGenerator({
            genSetNo: data.genSetNo,
            power: data.power,
            capacity: data.capacity,
            currHrs: data.currHrs,
            currDate: data.currDate?.split('T')[0] || '',
            lastHrs: data.lastHrs,
            lastDate: data.lastDate?.split('T')[0] || '',
            electricianId: electricianMatch ? electricianMatch.id : '',
            engineerId: engineerMatch ? engineerMatch.id : '',
          });
  
          setFuelDetails(data.generatorFuel || []);
          setLoading(false);
        } else {
          alert('Error fetching generator data.');
        }
      } catch (error) {
        console.error('Error fetching generator data:', error);
      }
    };
  
    const fetchDropdownData = async () => {
      try {
        const [electricianRes, engineerRes] = await Promise.all([
          fetch('/api/users/filtered?roles=Technician&departments=Electrical'),
          fetch('/api/users/filtered?roles=Supervisor&departments=Electrical'),
        ]);
  
        const electriciansData = await electricianRes.json();
        const engineersData = await engineerRes.json();
        setElectricians(electriciansData);
        setEngineers(engineersData);
  
        // Fetch generator data after dropdowns are loaded
        fetchGeneratorData(electriciansData, engineersData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
  
    if (id) {
      fetchDropdownData();
    }
  }, [id]); // Only trigger when `id` changes
  
  
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenerator((prev) => ({ ...prev, [name]: value }));
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
      currDate: new Date(generator.currDate),
      lastDate: generator.lastDate ? new Date(generator.lastDate) : null,
      generatorFuel: fuelDetails,
    };

    const response = await fetch(`/api/generator/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGenerator),
    });

    if (response.ok) {
      alert('Generator updated successfully!');
      router.push(`/daily-maintenance/generator`);
    } else {
      alert('Error updating generator.');
    }

    setLoading(false);
  };

  if (loading) return <p className="text-center text-lg py-8">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Generator Set Number</label>
              <input
                type="text"
                name="genSetNo"
                value={generator.genSetNo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                required
              />
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
                disabled
              />
            </div>
          </div>

          <h3 className="text-lg font-bold mt-4">Current Details</h3>
          <div className="grid grid-cols-2 gap-6">
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
          </div>

          <h3 className="text-lg font-bold mt-4">History</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Last Hours</label>
              <input
                type="number"
                name="lastHrs"
                value={generator.lastHrs}
                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                disabled
              />
            </div>
            <div>
              <label className="block mb-2">Last Date</label>
              <input
                type="date"
                name="lastDate"
                value={generator.lastDate}
                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                disabled
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

          <h3 className="text-lg font-bold mt-4">Staff</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Electrician Dropdown */}
          <div>
            <label className="block mb-2 text-white">Electrician Name</label>
            <select
              name="electricianId"
              value={generator.electricianId}
              onChange={(e) => setGenerator({ ...generator, electricianId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">Select Electrician</option>
              {electricians.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>

          {/* Engineer Dropdown */}
          <div>
            <label className="block mb-2 text-white">Supervisor Name</label>
            <select
              name="engineerId"
              value={generator.engineerId}
              onChange={(e) => setGenerator({ ...generator, engineerId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">Select Supervisor</option>
              {engineers.map((en) => (
                <option key={en.id} value={en.id}>
                  {en.name}
                </option>
              ))}
            </select>
          </div>

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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
