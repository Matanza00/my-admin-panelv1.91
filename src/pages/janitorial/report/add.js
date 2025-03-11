import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

const AddJanitorialReport = () => {
  const router = useRouter();
  const [janitorialReport, setJanitorialReport] = useState({
    date: "",
    supervisor: "",
    tenant: "",
    remarks: "",
    subJanReports: [],
  });
  const [tenants, setTenants] = useState([]);
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

  // Fetch tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("/api/tenants");
        if (response.ok) {
          const result = await response.json();
          setTenants(result.data || []);
        } else {
          console.error("Error fetching tenants");
        }
      } catch (error) {
        console.error("Error fetching tenants:", error);
        setTenants([]);
      }
    };

    fetchTenants();
  }, []);

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          "/api/users/filtered?roles=Supervisor&departments=Janitorial"
        );
        if (response.ok) {
          const result = await response.json();
          setSupervisors(result || []);
        } else {
          console.error("Error fetching supervisors");
        }
      } catch (error) {
        console.error("Error fetching supervisors:", error);
        setSupervisors([]);
      }
    };

    fetchSupervisors();
  }, []);

  const handleInputChange = (e, key) => {
    setJanitorialReport({ ...janitorialReport, [key]: e.target.value });
  };

  const handleSubReportChange = (index, key, value) => {
    const updatedSubReports = [...janitorialReport.subJanReports];
    updatedSubReports[index][key] = value;
    setJanitorialReport({ ...janitorialReport, subJanReports: updatedSubReports });
  };

  const addSubReport = () => {
    setJanitorialReport({
      ...janitorialReport,
      subJanReports: [
        ...janitorialReport.subJanReports,
        { id: Date.now(), floorNo: "", toilet: "", lobby: "", staircase: "" },
      ],
    });
  };

  const removeSubReport = (index) => {
    const updatedSubReports = [...janitorialReport.subJanReports];
    updatedSubReports.splice(index, 1);
    setJanitorialReport({ ...janitorialReport, subJanReports: updatedSubReports });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subJanReportsToSend = janitorialReport.subJanReports.map((sub) => ({
      floorNo: sub.floorNo,
      toilet: sub.toilet,
      lobby: sub.lobby,
      staircase: sub.staircase,
    }));
    const session = await getSession(); // Ensure session is retrieved

    if (!session) {
      console.error("❌ User not authenticated");
      return;
    }

    const response = await fetch("/api/janitorial-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`, // Include token
      },
      body: JSON.stringify({
        date: janitorialReport.date,
        supervisor: janitorialReport.supervisor,
        tenant: tenants.find(t => t.id == janitorialReport.tenant)?.tenantName || janitorialReport.tenant, // ✅ Convert ID to name if needed
        remarks: janitorialReport.remarks,
        subJanReports: subJanReportsToSend,
        createdById: userId,
      }),
      
    });
    console.log({
      date: janitorialReport.date,
      supervisor: janitorialReport.supervisor,
      tenant: janitorialReport.tenant,
      remarks: janitorialReport.remarks,
      subJanReports: subJanReportsToSend,
    });
    if (response.ok) {
      router.push("/janitorial/report");
    } else {
      console.error("Failed to save report:", response.statusText);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Janitorial Inspection Report</h1>
        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div>
              <label className="block font-medium">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={janitorialReport.date}
                onChange={(e) => handleInputChange(e, "date")}
                required
              />
            </div>
            <div>
              <label className="block font-medium">Supervisor</label>
              <select
                className="w-full p-2 border rounded"
                value={janitorialReport.supervisor}
                onChange={(e) => handleInputChange(e, "supervisor")}
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
            <div>
              <label htmlFor="tenant" className="block font-medium">Tenant</label>
              <select
                id="tenant"
                onChange={(e) => handleInputChange(e, "tenant")}
                className="w-full p-4 border rounded"
                required
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.tenantName}>  {/* ✅ Store tenantName instead */}
                    {tenant.tenantName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Remarks</label>
              <textarea
                className="w-full p-2 border rounded"
                value={janitorialReport.remarks}
                onChange={(e) => handleInputChange(e, "remarks")}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Sub Reports</h2>
          {janitorialReport.subJanReports.map((subReport, index) => (
            <div key={subReport.id} className="mb-4 p-4 border rounded-lg bg-white">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-medium">Floor No</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={subReport.floorNo}
                    onChange={(e) =>
                      handleSubReportChange(index, "floorNo", e.target.value)
                    }
                  >
                    <option value="">Select Floor</option>
                    <option value="Basement">Basement</option>
                    <option value="Ground Floor">Ground Floor</option>
                    {Array.from({ length: 19 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Floor {i + 1}
                      </option>
                    ))}
                    <option value="Rooftop">Rooftop</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium">Toilet</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={subReport.toilet}
                    onChange={(e) =>
                      handleSubReportChange(index, "toilet", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Unsatisfactory">Unsatisfactory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium">Lobby</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={subReport.lobby}
                    onChange={(e) =>
                      handleSubReportChange(index, "lobby", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Unsatisfactory">Unsatisfactory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium">Staircase</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={subReport.staircase}
                    onChange={(e) =>
                      handleSubReportChange(index, "staircase", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Unsatisfactory">Unsatisfactory</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeSubReport(index)}
                className="mt-4 text-red-600 hover:underline"
              >
                Remove Sub Report
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubReport}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Sub Report
          </button>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Report
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddJanitorialReport;