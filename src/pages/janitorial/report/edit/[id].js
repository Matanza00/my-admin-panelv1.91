import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";

const EditJanitorialReport = () => {
  const router = useRouter();
  const { id } = router.query; // Get the report ID from the URL
  const [loading, setLoading] = useState(true);
  const [janitorialReport, setJanitorialReport] = useState({
    date: "",
    supervisor: "",
    tenant: "",
    remarks: "",
    subJanReports: [], // Initialize with an empty array
  });
  const [supervisors, setSupervisors] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Fetch supervisors and tenants for dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [supervisorsRes, tenantsRes] = await Promise.all([
          fetch("/api/users/filtered?roles=Supervisor&departments=Janitorial"),
          fetch("/api/tenants"),
        ]);

        if (supervisorsRes.ok) {
          const supervisorsData = await supervisorsRes.json();
          setSupervisors(supervisorsData);
        }

        if (tenantsRes.ok) {
          const tenantsData = await tenantsRes.json();
          setTenants(tenantsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch Janitorial Report data on component load
  useEffect(() => {
    if (id) {
      fetch(`/api/janitorial-report/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setJanitorialReport({
            ...data,
            supervisor: data.supervisor.id, // Preselect supervisor ID
            tenant: data.tenant.id, // Preselect tenant ID
            date: new Date(data.date).toISOString().split("T")[0], // Format date for input
            subJanReports: data.subJanReport || [], // Ensure `subJanReports` is an array
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch report:", err);
          setLoading(false);
        });
    }
  }, [id]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const subJanReportsToSend = janitorialReport.subJanReports.map((sub) => ({
      id: sub.id, // Include the ID for existing sub-reports
      floorNo: sub.floorNo,
      toilet: sub.toilet,
      lobby: sub.lobby,
      staircase: sub.staircase,
    }));
    console.log({
      date: janitorialReport.date,
      supervisor: janitorialReport.supervisor,
      tenant: janitorialReport.tenant,
      remarks: janitorialReport.remarks,
      subJanReports: subJanReportsToSend,
    })
    fetch(`/api/janitorial-report/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: janitorialReport.date,
        supervisor: janitorialReport.supervisor,
        tenant: janitorialReport.tenant,
        remarks: janitorialReport.remarks,
        subJanReports: subJanReportsToSend,
      }),
    })
      .then((res) => {
        if (res.ok) {
          router.push(`/janitorial/report/view/${id}`); // Redirect after successful update
        } else {
          console.error("Failed to save report:", res.statusText);
        }
      })
      .catch((err) => console.error("Error saving report:", err));
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page in history
  };

  if (loading) {
    return <Layout><p>Loading...</p></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Janitorial Inspection Report</h1>

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
              <label className="block font-medium">Tenant</label>
              <select
                className="w-full p-2 border rounded"
                value={janitorialReport.tenant}
                onChange={(e) => handleInputChange(e, "tenant")}
                required
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
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
                    {Array.from({ length: 19 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Floor {i + 1}
                      </option>
                    ))}
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
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditJanitorialReport;