// /pages/security/reports/add.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";

export default function AddSecurityReport() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: "",
    observedBy: "",
    supervisor: "",
    description: "",
    action: "",
    timeNoted: "",
    timeSolved: "",
  });

  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
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
    // Fetch data for Observed By dropdown
    const fetchTechnicians = async () => {
      try {
        const response = await fetch(
          "/api/users/filtered?roles=technician&departments=Security%20GUARD"
        );
        const data = await response.json();
        setTechnicians(data || []);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    // Fetch data for Supervisor dropdown
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          "/api/users/filtered?roles=Supervisor&departments=Security"
        );
        const data = await response.json();
        setSupervisors(data || []);
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      }
    };

    fetchTechnicians();
    fetchSupervisors();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      date: formData.date,
      observedBy: parseInt(formData.observedBy),
      supervisor: parseInt(formData.supervisor),
      description: formData.description,
      action: formData.action,
      timeNoted: formData.timeNoted,
      timeSolved: formData.timeSolved,
    };

    try {
      const res = await fetch("/api/security-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formattedData, createdById: userId }), // Include createdById
      });

      if (res.ok) {
        router.push("/security-services/security-reports");
      } else {
        console.error("Failed to create a new report");
      }
    } catch (error) {
      console.error("Error creating new report:", error);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Add New Security Report</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block">Observed By</label>
            <select
              name="observedBy"
              value={formData.observedBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                Select Observer
              </option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block">Supervisor</label>
            <select
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                Select Supervisor
              </option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block">Action</label>
            <textarea
              name="action"
              value={formData.action}
              onChange={handleChange}
              placeholder="Enter Action Taken"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block">Time Noted</label>
            <input
              type="time"
              name="timeNoted"
              value={formData.timeNoted}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block">Time Solved</label>
            <input
              type="time"
              name="timeSolved"
              value={formData.timeSolved}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Security Report
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
