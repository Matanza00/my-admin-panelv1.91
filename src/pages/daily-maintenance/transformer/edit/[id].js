import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../../../../components/layout';

export default function EditTransformer() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    transformerNo: "",
    lastMaintenance: "",
    nextMaintenance: "",
    lastDehydration: "",
    nextDehydration: "",
    temp: "",
    tempStatus: "", 
    HTvoltage: "", 
    HTStatus: "", 
    LTvoltage: "", 
    LTStatus: "", 
    engineerId: "", 
  });

  const [engineers, setEngineers] = useState([]);
  const [transformer, setTransformer] = useState(null);
  const [ previoustransformer,setPreviousTransformer] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/transformer/${id}`)
        .then((res) => res.json())
        .then(({ transformer, previousTransformer }) => {
          setTransformer(transformer);
          setPreviousTransformer(previousTransformer);

          setFormData({
            transformerNo: transformer?.transformerNo || "",
            lastMaintenance: transformer?.lastMaintenance
              ? transformer.lastMaintenance.split("T")[0]
              : "",
            nextMaintenance: transformer?.nextMaintenance
              ? transformer.nextMaintenance.split("T")[0]
              : "",
            lastDehydration: transformer?.lastDehydration
              ? transformer.lastDehydration.split("T")[0]
              : "",
            nextDehydration: transformer?.nextDehydration
              ? transformer.nextDehydration.split("T")[0]
              : "",
            temp: transformer?.temp || "",
            tempStatus: transformer?.tempStatus || "N/A",
            HTvoltage: transformer?.HTvoltage || "",
            HTStatus: transformer?.HTStatus || "Normal",
            LTvoltage: transformer?.LTvoltage || "",
            LTStatus: transformer?.LTStatus || "Normal",
            engineerId: transformer?.engineer || "",
          });
        })
        .catch((error) => console.error("Failed to fetch transformer data:", error));
    }

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      if (name === "temp") {
        const tempValue = parseFloat(value);
        updatedFormData.tempStatus =
          tempValue < 40 ? "Low" : tempValue > 50 ? "High" : "Normal";
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch(`/api/transformer/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Transformer updated successfully!");
      router.push("/daily-maintenance/transformer");
    } else {
      alert("Failed to update transformer!");
    }
  };

  if (!transformer) return <p className="text-center text-lg">Loading...</p>;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Edit Transformer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transformer Dropdown */}
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
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Last Dehydration:</label>
                <input
                  type="date"
                  name="lastDehydration"
                  value={formData.lastDehydration}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
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
            <div className="grid grid-cols-2 gap-4">
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
              <label className="block font-medium">HT Voltage Status:</label>
              <select
                name="HTStatus"
                value={formData.HTStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
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
              <label className="block font-medium">LT Voltage Status:</label>
              <select
                name="LTStatus"
                value={formData.LTStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Engineer Dropdown */}
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
}
