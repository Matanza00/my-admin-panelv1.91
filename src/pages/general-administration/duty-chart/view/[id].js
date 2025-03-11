import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";

const ViewDutyChartPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [dutyChart, setDutyChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDutyChart = async () => {
      try {
        const response = await fetch(`/api/dutychart/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch duty chart details");
        }
        const data = await response.json();
        setDutyChart(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDutyChart();
  }, [id]);

  if (loading) {
    return <Layout>Loading...</Layout>;
  }

  if (error) {
    return <Layout>Error: {error}</Layout>;
  }

  if (!dutyChart) {
    return <Layout>No duty chart found.</Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Duty Chart Details</h1>

        <div className="mb-6 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Duty Chart Information</h2>
          <p><strong>Date:</strong> {new Date(dutyChart.date).toLocaleString()}</p>
          <p><strong>Supervisor:</strong> {dutyChart.supervisor}</p>
          <p><strong>Remarks:</strong> {dutyChart.remarks || "N/A"}</p>
          {dutyChart.picture && (
            <div className="mt-4">
              <h3 className="font-semibold">Picture:</h3>
              <img
                src={dutyChart.picture}
                alt="Duty Chart"
                className="w-full h-auto max-w-[300px] rounded cursor-pointer"
                onClick={() => setShowPreview(true)}
              />
            </div>
          )}
        </div>

        <div className="mb-6 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Attendance</h2>
          {dutyChart.attendance && dutyChart.attendance.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Designation</th>
                  <th className="border border-gray-300 p-2">Time In</th>
                  <th className="border border-gray-300 p-2">Time Out</th>
                  <th className="border border-gray-300 p-2">Lunch In</th>
                  <th className="border border-gray-300 p-2">Lunch Out</th>
                </tr>
              </thead>
              <tbody>
                {dutyChart.attendance.map((att) => (
                  <tr key={att.id}>
                    <td className="border border-gray-300 p-2">{att.name}</td>
                    <td className="border border-gray-300 p-2">{att.designation}</td>
                    <td className="border border-gray-300 p-2">
                      {att.timeIn ? new Date(att.timeIn).toLocaleString() : "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {att.timeOut ? new Date(att.timeOut).toLocaleString() : "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {att.lunchIn ? new Date(att.lunchIn).toLocaleString() : "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {att.lunchOut ? new Date(att.lunchOut).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No attendance records available.</p>
          )}
        </div>

        {showPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowPreview(false)}
          >
            <div className="relative bg-white rounded shadow">
              <button
                className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-2"
                onClick={() => setShowPreview(false)}
              >
                &times;
              </button>
              <img
                src={dutyChart.picture}
                alt="Duty Chart Preview"
                className="w-full h-auto max-w-[90vw] max-h-[90vh] rounded"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewDutyChartPage;
