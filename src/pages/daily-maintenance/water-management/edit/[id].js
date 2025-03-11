import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import pumpsAndTanks from "../../../../constant"; // Assuming pumpsAndTanks contains pump data

const EditWaterManagement = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [pumps, setPumps] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [operators, setOperators] = useState([]);

  // Fetch data for editing
  useEffect(() => {
    const fetchWaterManagementData = async () => {
      if (!id) return;
  
      try {
        // Fetch water management project data first
        const response = await fetch(`/api/water-management/${id}`);
        if (!response.ok) throw new Error("Failed to fetch water management data");
  
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setPumps(data.pumps);
  
        // Fetch supervisors and operators for dropdowns
        const [supervisorsResponse, operatorsResponse] = await Promise.all([
          fetch(`/api/users/filtered?roles=Supervisor&departments=Building`),
          fetch(`/api/users/filtered?roles=Technician&departments=Building`),
        ]);
  
        if (!supervisorsResponse.ok || !operatorsResponse.ok) {
          throw new Error("Failed to fetch supervisors or operators");
        }
  
        const supervisorsData = await supervisorsResponse.json();
        const operatorsData = await operatorsResponse.json();
  
        setSupervisors(supervisorsData);
        setOperators(operatorsData);
  
        // Preselect dropdown values by matching names with IDs
        const supervisorMatch = supervisorsData.find((sup) => sup.name === data.supervisorName);
        const operatorMatch = operatorsData.find((op) => op.name === data.operatorName);
  
        setSupervisorId(supervisorMatch ? supervisorMatch.id.toString() : "");
        setOperatorId(operatorMatch ? operatorMatch.id.toString() : "");
      } catch (error) {
        console.error("Error fetching water management data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWaterManagementData();
  }, [id]);
  
  

  const handleAddPump = () => {
    const newPump = {
      name: "",
      capacity: "",
      location: "",
      checks: [
        {
          waterSealStatus: "",
          pumpBearingStatus: "",
          motorBearingStatus: "",
          rubberCouplingStatus: "",
          pumpImpellerStatus: "",
          mainValvesStatus: "",
          motorWindingStatus: "",
        },
      ],
    };
    setPumps([...pumps, newPump]);
  };

  const handleUpdatePump = (index, field, value) => {
    const updatedPumps = [...pumps];
    updatedPumps[index][field] = value;

    if (field === "name") {
      const selectedPump = pumpsAndTanks.find((pump) => pump.name === value);
      if (selectedPump) {
        updatedPumps[index].capacity = selectedPump.capacity;
        updatedPumps[index].location = selectedPump.location;
      } else {
        updatedPumps[index].capacity = "";
        updatedPumps[index].location = "";
      }
    }
    setPumps(updatedPumps);
  };

  const handleUpdatePumpCheck = (pumpIndex, checkIndex, field, value) => {
    const updatedPumps = [...pumps];
    updatedPumps[pumpIndex].checks[checkIndex][field] = value;
    setPumps(updatedPumps);
  };

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
      const response = await fetch(`/api/water-management/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Water management updated successfully");
        router.push(`/daily-maintenance/water-management`);
      } else {
        const errorData = await response.json();
        console.error("Error updating water management:", errorData.error);
        alert("Failed to update");
      }
    } catch (error) {
      console.error("Error updating water management:", error);
      alert("Failed to update");
    }
  };

  if (loading) return <div>Loading...</div>;
console.log("hello",supervisorId)
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-semibold mb-6">Edit Water Management</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title and Description */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            />
          </div>

          {/* Supervisor Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Supervisor</label>
            <select
              value={supervisorId}
              onChange={(e) => setSupervisorId(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
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

          {/* Operator Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Operator</label>
            <select
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
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

          {/* Pumps Section */}
          <div className="mb-4">
            <h3 className="text-white mb-2">Pumps</h3>
            {pumps.map((pump, pumpIndex) => (
              <div key={pumpIndex} className="space-y-4 bg-gray-800 p-4 rounded-md mb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <select
                    value={pump.name}
                    onChange={(e) => handleUpdatePump(pumpIndex, "name", e.target.value)}
                    className="px-4 py-2 rounded-md bg-gray-700 text-white"
                  >
                    <option value="">Select Pump</option>
                    {pumpsAndTanks.map((pumpOption) => (
                      <option key={pumpOption.name} value={pumpOption.name}>
                        {pumpOption.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={pump.capacity}
                    readOnly
                    className="px-4 py-2 rounded-md bg-gray-700 text-white"
                    placeholder="Capacity"
                  />
                  <input
                    type="text"
                    value={pump.location}
                    readOnly
                    className="px-4 py-2 rounded-md bg-gray-700 text-white"
                    placeholder="Location"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {pump.checks &&
                    pump.checks.map((check, checkIndex) =>
                      Object.entries(check)
                        .filter(([key]) => !["id", "pumpId", "createdAt", "updatedAt"].includes(key))
                        .map(([key, value]) => (
                          <div key={`${key}-${checkIndex}`}>
                            <label className="text-white mb-1 capitalize">
                              {key.replace(/Status$/, "").replace(/([A-Z])/g, " $1").trim()}
                            </label>
                            <select
                              value={value || ""}
                              onChange={(e) =>
                                handleUpdatePumpCheck(pumpIndex, checkIndex, key, e.target.value)
                              }
                              className="px-3 py-2 rounded-md bg-gray-700 text-white w-full"
                            >
                              <option value="">Select {key.replace(/Status$/, "").replace(/([A-Z])/g, " $1").trim()}</option>
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
              className="px-4 py-2 bg-green-600 rounded-md text-white w-full"
            >
              Add New Pump
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Update Water Management
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditWaterManagement;
