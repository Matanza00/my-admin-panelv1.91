import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../../../../components/layout';

export default function ViewGenerator() {
  const [generator, setGenerator] = useState(null);
  const [fuelDetails, setFuelDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchGenerator() {
      if (!id) return;
      const response = await fetch(`/api/generator/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGenerator(data);
        setFuelDetails(data.generatorFuel || []);
        setLoading(false);
      } else {
        alert("Failed to fetch generator data.");
      }
    }
    fetchGenerator();
  }, [id]);

  if (loading) return <p className="text-center text-lg py-8 text-gray-600">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Generator Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium text-gray-300 mb-1">Generator Set Number:</label>
            <input
              type="text"
              value={generator.genSetNo}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-300 mb-1">Power:</label>
            <input
              type="text"
              value={generator.power}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-300 mb-1">Capacity:</label>
            <input
              type="number"
              value={generator.capacity}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold mt-6">Current Details</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium text-gray-300 mb-1">Current Hours:</label>
            <input
              type="number"
              value={generator.currHrs}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            />
          </div>
          <div>
  <label className="block font-medium text-gray-300 mb-1">Current Date:</label>
  <input
    type="text" // Change to text to display formatted date and time
    value={`${new Date(generator.currDate).toLocaleDateString('en-GB')} Time: ${String(new Date(generator.currDate).getHours()).padStart(2, '0')}:${String(new Date(generator.currDate).getMinutes()).padStart(2, '0')}:${String(new Date(generator.currDate).getSeconds()).padStart(2, '0')}`}
    readOnly
    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
  />
</div>

        </div>

        <h3 className="text-lg font-bold mt-6">History</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium text-gray-300 mb-1">Last Hours:</label>
            <input
              type="number"
              value={generator.lastHrs}
              readOnly
              className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-300 mb-1">Last Date:</label>
            <input
              type="date"
              value={generator.lastDate.split("T")[0]}
              readOnly
              className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold mt-6">Fuel Details</h3>
        {fuelDetails.length > 0 ? (
          <div className="space-y-4 mt-4">
            {fuelDetails.map((fuel, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center bg-gray-700 p-4 rounded-md shadow-sm"
              >
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Fuel Last:</label>
                  <input
                    type="number"
                    value={fuel.fuelLast}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Fuel Consumed:</label>
                  <input
                    type="number"
                    value={fuel.fuelConsumed}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Fuel Received:</label>
                  <input
                    type="number"
                    value={fuel.fuelReceived}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Available:</label>
                  <input
                    type="number"
                    value={fuel.available}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-600 rounded-md text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-400">No fuel details available.</p>
        )}

        <h3 className="text-lg font-bold mt-6">Staff</h3>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block font-medium text-gray-300 mb-1">Electrician Name:</label>
            <input
              type="text"
              value={generator.electricianName}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-300 mb-1">Supervisor Name:</label>
            <input
              type="text"
              value={generator.engineerName}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
            />
          </div>
        </div>

        <button
          onClick={() => router.push("/daily-maintenance/generator")}
          className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
        >
          Back to Generators List
        </button>
      </div>
    </Layout>
  );
}
