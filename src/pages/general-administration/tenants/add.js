import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";

export default function AddTenant() {
  const [tenants, setTenants] = useState([]); // State to store fetched tenant options
  const [selectedTenantId, setSelectedTenantId] = useState(""); // State for selected tenant ID
  const [tenantName, setTenantName] = useState(""); // State for tenant name input
  const [totalAreaSq, setTotalAreaSq] = useState(0); // Start with 0 as initial value
  const [areas, setAreas] = useState([{ floor: "", occupiedArea: "", location: "" }]); // State to store areas
  const router = useRouter();

  // Fetch tenants from API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("/api/users/filtered?roles=tenant");
        if (response.ok) {
          const data = await response.json();
          setTenants(data); // Update tenants state with fetched data
        } else {
          console.error("Failed to fetch tenants.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTenants();
  }, []);

  // Function to update the total area
  const calculateTotalArea = () => {
    const total = areas.reduce((sum, area) => {
      const occupiedArea = parseFloat(area.occupiedArea) || 0; // Add area only if valid
      return sum + occupiedArea;
    }, 0);
    setTotalAreaSq(total); // Update the total area
  };

  // Recalculate total area whenever areas or their occupiedArea changes
  useEffect(() => {
    calculateTotalArea();
  }, [areas]); // Trigger recalculation when areas change

  const handleAreaChange = (index, field, value) => {
    const updatedAreas = [...areas];
    updatedAreas[index][field] = value;
    setAreas(updatedAreas);
  };

  const addArea = () => {
    setAreas([...areas, { floor: "", occupiedArea: "", location: "" }]);
  };

  const removeArea = (index) => {
    const updatedAreas = areas.filter((_, i) => i !== index);
    setAreas(updatedAreas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tenantData = {
      tenantName: tenantName, // Send tenant name from input
      userId: selectedTenantId, // Send tenant ID as userId
      totalAreaSq, // Use the dynamic total area
      areas: areas.map((area) => ({
        floor: area.floor,
        occupiedArea: parseFloat(area.occupiedArea),
        location: area.location,
      })),
    };
    console.log(tenantData)
    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tenantData),
      });

      if (response.ok) {
        router.push("/general-administration/tenants");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Failed to add tenant.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding tenant.");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-6">Add Tenant</h1>
        <form onSubmit={handleSubmit}>
          {/* Tenant Name Input */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Tenant Name</label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Tenant ID Dropdown */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Select Tenant User (user with tenant role)</label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="" disabled>Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Total Area */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Total Area (Sq.ft)</label>
            <input
              type="number"
              value={totalAreaSq}
              disabled
              className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-gray-200"
            />
          </div>

          {/* Areas Section */}
          <h2 className="text-2xl font-semibold mb-4">Areas</h2>
          {areas.map((area, index) => (
            <div key={index} className="space-y-4 mb-6">
              <div className="flex gap-4">
                {/* Floor */}
                <div className="flex-1">
                  <label className="block text-lg font-medium text-gray-700">Floor</label>
                  <input
                    type="text"
                    value={area.floor}
                    onChange={(e) => handleAreaChange(index, "floor", e.target.value)}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Occupied Area */}
                <div className="flex-1">
                  <label className="block text-lg font-medium text-gray-700">Occupied Area (Sq.ft)</label>
                  <input
                    type="number"
                    value={area.occupiedArea}
                    onChange={(e) => handleAreaChange(index, "occupiedArea", e.target.value)}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Location */}
                <div className="flex-1">
                  <label className="block text-lg font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={area.location}
                    onChange={(e) => handleAreaChange(index, "location", e.target.value)}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeArea(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Remove Area
              </button>
            </div>
          ))}

          {/* Add Area Button */}
          <button
            type="button"
            onClick={addArea}
            className="mb-6 py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Add Area
          </button>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-6 text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              Save Tenant
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
