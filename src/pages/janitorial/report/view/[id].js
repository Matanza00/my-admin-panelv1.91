import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import { getSession, useSession } from "next-auth/react"; // If using next-auth
import { FaArrowLeft, FaUserTie, FaBuilding, FaStickyNote, FaCalendarAlt } from "react-icons/fa"; // Import icons

const ViewJanitorialReport = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data
  const { id } = router.query; // Get the report ID from the URL
  const [loading, setLoading] = useState(true);
  const [janitorialReport, setJanitorialReport] = useState({
    date: "",
    supervisor: "",
    tenant: "",
    remarks: "",
    subJanReports: [],
  });

  // Fetch Janitorial Report on component load
  useEffect(() => {
    if (id && session?.user?.accessToken) {
      fetch(`/api/janitorial-report/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!data || Object.keys(data).length === 0) {
            throw new Error("Empty response from server");
          }

          setJanitorialReport({
            ...data,
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "N/A",
            subJanReports: Array.isArray(data.subJanReport) ? data.subJanReport : [],
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch report:", err.message);
          setLoading(false);
        });
    }
  }, [id, session]);

  // Handle back button click
  const handleBack = () => {
    router.back(); // Navigate to the previous page in history
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-lg font-semibold text-gray-600">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Janitorial Inspection Report</h1>
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        {/* Janitorial Report Fields */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="flex items-center bg-gray-100 p-3 rounded border">
            <FaCalendarAlt className="text-gray-600 mr-2" />
            <div>
              <label className="block font-medium text-gray-700">Date</label>
              <p className="text-gray-900 font-semibold">{janitorialReport.date}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded border">
            <FaUserTie className="text-gray-600 mr-2" />
            <div>
              <label className="block font-medium text-gray-700">Supervisor</label>
              <p className="text-gray-900 font-semibold">{janitorialReport.supervisor ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded border">
            <FaBuilding className="text-gray-600 mr-2" />
            <div>
              <label className="block font-medium text-gray-700">Tenant</label>
              <p className="text-gray-900 font-semibold">{janitorialReport.tenant || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded border">
            <FaStickyNote className="text-gray-600 mr-2" />
            <div>
              <label className="block font-medium text-gray-700">Remarks</label>
              <p className="text-gray-900 font-semibold">{janitorialReport.remarks}</p>
            </div>
          </div>
        </div>

        {/* Sub Reports Section */}
        <h2 className="text-xl font-semibold mb-4">Sub Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Floor No</th>
                <th className="border border-gray-300 px-4 py-2">Toilet</th>
                <th className="border border-gray-300 px-4 py-2">Lobby</th>
                <th className="border border-gray-300 px-4 py-2">Staircase</th>
              </tr>
            </thead>
            <tbody>
              {janitorialReport.subJanReports.map((subReport) => (
                <tr key={subReport.id} className="text-center border-b border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{subReport.floorNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{subReport.toilet}</td>
                  <td className="border border-gray-300 px-4 py-2">{subReport.lobby}</td>
                  <td className="border border-gray-300 px-4 py-2">{subReport.staircase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ViewJanitorialReport;
