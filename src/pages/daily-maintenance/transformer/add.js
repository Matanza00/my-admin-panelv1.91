import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";

export default function AddTransformer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    transformerNo: "",
    date: "",
    lastMaintenance: "",
    nextMaintenance: "",
    lastDehydration: "",
    nextDehydration: "",
    temp: "",
    tempStatus: "", // New field for temperature status
    HTvoltage: "", // HT voltage field
    HTStatus: "", // HT voltage status
    LTvoltage: "", // LT voltage field
    LTStatus: "", // LT voltage status
    engineerId: "",
  });

  const [engineers, setEngineers] = useState([]);
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
    // Fetch engineers for dropdown
    const fetchEngineers = async () => {
      try {
        const response = await fetch(
          "/api/users/filtered?roles=Supervisor&departments=Electrical"
        );
        const data = await response.json();
        if (response.ok) {
          setEngineers(data || []);
        }
      } catch (error) {
        console.error("Error fetching engineers:", error);
      }
    };

    fetchEngineers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      // Automatically detect and set temperature status
      if (name === "temp") {
        const tempValue = parseFloat(value);
        if (tempValue < 40) {
          updatedFormData.tempStatus = "Low";
        } else if (tempValue > 50) {
          updatedFormData.tempStatus = "High";
        } else {
          updatedFormData.tempStatus = "Normal";
        }
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formData, createdById: userId })
    const response = await fetch("/api/transformer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, createdById: userId }), // Include createdById
    });

    if (response.ok) {
      alert("Transformer added successfully!");
      router.push("/daily-maintenance/transformer");
    } else {
      alert("Failed to add transformer!");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Add New Transformer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Static Transformer Name Dropdown */}
          <div>
            <label className="block font-medium">Transformer Name:</label>
            <select
              name="transformerNo"
              value={formData.transformerNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>Select Transformer</option>
              <option value="Transformer No 1">Transformer No 1</option>
              <option value="Transformer No 2">Transformer No 2</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* HISTORY Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">History</h2>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-medium">Last Maintenance:</label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  disabled
                  className="w-full p-2 border rounded bg-gray-300"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Last Dehydration:</label>
                <input
                  type="date"
                  name="lastDehydration"
                  value={formData.lastDehydration}
                  disabled
                  className="w-full p-2 border rounded bg-gray-300"
                />
              </div>
            </div>
          </div>

          {/* FUTURE Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Future</h2>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-medium">Next Maintenance:</label>
                <input
                  type="date"
                  name="nextMaintenance"
                  value={formData.nextMaintenance}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Next Dehydration:</label>
                <input
                  type="date"
                  name="nextDehydration"
                  value={formData.nextDehydration}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="flex gap-4">
            <div>
              <label className="block font-medium">Temperature (°C):</label>
              <input
                type="number"
                name="temp"
                value={formData.temp}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-600">
                Status: <span className="font-bold">{formData.tempStatus || "N/A"}</span>
              </p>
            </div>

          </div>

          <div className="flex gap-4">
            
          <div>
              <label className="block font-medium">HT Voltage:</label>
              <input
                type="number"
                name="HTvoltage"
                value={formData.HTvoltage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">HT Status:</label>
              <select
                name="HTStatus"
                value={formData.HTStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>Select HT Status</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
            
          <div className="flex gap-4">
          <div>
              <label className="block font-medium">LT Voltage:</label>
              <input
                type="number"
                name="LTvoltage"
                value={formData.LTvoltage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          
            <div>
              <label className="block font-medium">LT Status:</label>
              <select
                name="LTStatus"
                value={formData.LTStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>Select LT Status</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Supervisor Dropdown */}
          <div>
            <label className="block font-medium">Supervisor:</label>
            <select
              name="engineerId"
              value={formData.engineerId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>Select Supervisor</option>
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Transformer
          </button>
        </form>
      </div>
    </Layout>
  );
}
