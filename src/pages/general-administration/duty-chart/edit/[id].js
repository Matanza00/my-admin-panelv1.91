import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";

// Helper function to convert UTC to local time
const convertToLocalTimeForInput  = (utcDateTime) => {
  if (!utcDateTime) return "";
  const localDate = new Date(utcDateTime);

  // Format to "YYYY-MM-DDTHH:MM" required by <input type="datetime-local">
  return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}T${String(localDate.getHours()).padStart(2, "0")}:${String(localDate.getMinutes()).padStart(2, "0")}`;
};



const EditDutyChartPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [dutyChart, setDutyChart] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Duty Chart data
  useEffect(() => {
    if (!id) return;

    const fetchDutyChart = async () => {
      try {
        const response = await fetch(`/api/dutychart/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch duty chart. Status: ${response.status}`);

        const data = await response.json();
        setDutyChart(data);
        setAttendance(
          data.attendance?.map((att) => ({
            ...att,
            timeIn: convertToLocalTimeForInput(att.timeIn),
            timeOut: convertToLocalTimeForInput(att.timeOut),
            lunchIn: convertToLocalTimeForInput(att.lunchIn),
            lunchOut: convertToLocalTimeForInput(att.lunchOut),
          })) || []
        );
      } catch (err) {
        console.error("❌ Error fetching duty chart:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDutyChart();
  }, [id]);

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch("/api/users/filtered?roles=supervisor&department=Building");
        if (!response.ok) throw new Error(`Failed to fetch supervisors. Status: ${response.status}`);

        const data = await response.json();
        setSupervisors(data || []);
      } catch (err) {
        console.error("❌ Error fetching supervisors:", err);
        setError(err.message);
      }
    };

    fetchSupervisors();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleAttendanceChange = (index, field, value) => {
    const newAttendance = [...attendance];
    newAttendance[index] = { ...newAttendance[index], [field]: value };
    setAttendance(newAttendance);
  };

  const handleAddAttendance = () => {
    setAttendance([
      ...attendance,
      {
        id: Date.now(),
        name: "",
        designation: "",
        timeIn: "",
        timeOut: "",
        lunchIn: "",
        lunchOut: "",
        dutyChartId: dutyChart?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ]);
  };

  const handleRemoveAttendance = (index) => {
    setAttendance(attendance.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let pictureUrl = dutyChart.picture;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadResponse.ok) throw new Error("Image upload failed");

        const result = await uploadResponse.json();
        pictureUrl = `/uploads/${result.filename}`;
      } catch (err) {
        alert(err.message);
        return;
      }
    }

    const requestBody = {
      id: dutyChart.id,
      date: dutyChart.date,
      supervisor: dutyChart.supervisor,
      remarks: dutyChart.remarks,
      picture: pictureUrl,
      attendance,
    };

    try {
      const response = await fetch(`/api/dutychart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Error updating duty chart");

      alert("Duty chart updated successfully");
      router.push("/general-administration/duty-chart");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!dutyChart) return <div className="text-red-600">Error loading duty chart.</div>;

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Duty Chart</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="datetime-local"
              value={dutyChart.date ? dutyChart.date.slice(0, 16) : ""}
              onChange={(e) => setDutyChart({ ...dutyChart, date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Supervisor</label>
            <select
              className="w-full p-2 border rounded"
              value={dutyChart.supervisor || ""}
              onChange={(e) => setDutyChart({ ...dutyChart, supervisor: e.target.value })}
            >
              {/* If a supervisor is set, select it */}
              {dutyChart.supervisor && !supervisors.some(sup => sup.id === dutyChart.supervisor) && (
                <option value={dutyChart.supervisor} disabled>
                  {dutyChart.supervisor} (Not Found)
                </option>
              )}

              <option value="">Select Supervisor</option> 
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.name}
                </option>
              ))}
            </select>
          </div>



          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={dutyChart.remarks || ""}
              onChange={(e) => setDutyChart({ ...dutyChart, remarks: e.target.value })}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="mt-2 max-w-[300px] rounded" />
            ) : dutyChart.picture ? (
              <img src={dutyChart.picture} alt="Current Duty Chart" className="mt-2 max-w-[300px] rounded" />
            ) : (
              <div className="mt-2 text-gray-500">No image found</div>
            )}
          </div>

          <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Attendance</h2>
{attendance.map((att, index) => (
  <div key={index} className="flex flex-wrap gap-4 mb-2">
    {/* Name Field */}
    <input
      type="text"
      value={att.name || ""}
      onChange={(e) => handleAttendanceChange(index, "name", e.target.value)}
      placeholder="Name"
      className="p-2 border rounded w-1/6"
    />

    {/* Designation Field */}
    <input
      type="text"
      value={att.designation || ""}
      onChange={(e) => handleAttendanceChange(index, "designation", e.target.value)}
      placeholder="Designation"
      className="p-2 border rounded w-1/6"
    />

   {/* Time In Field */}
<input
  type="datetime-local"
  value={convertToLocalTimeForInput(att.timeIn)}
  onChange={(e) => handleAttendanceChange(index, "timeIn", e.target.value)}
  className="p-2 border rounded w-1/6"
/>

{/* Time Out Field */}
<input
  type="datetime-local"
  value={convertToLocalTimeForInput(att.timeOut)}
  onChange={(e) => handleAttendanceChange(index, "timeOut", e.target.value)}
  className="p-2 border rounded w-1/6"
/>

{/* Lunch In Field */}
<input
  type="datetime-local"
  value={convertToLocalTimeForInput(att.lunchIn)}
  onChange={(e) => handleAttendanceChange(index, "lunchIn", e.target.value)}
  className="p-2 border rounded w-1/6"
/>

{/* Lunch Out Field */}
<input
  type="datetime-local"
  value={convertToLocalTimeForInput(att.lunchOut)}
  onChange={(e) => handleAttendanceChange(index, "lunchOut", e.target.value)}
  className="p-2 border rounded w-1/6"
/>


    {/* Remove Button */}
    <button
      type="button"
      onClick={() => handleRemoveAttendance(index)}
      className="bg-red-500 text-white p-2 rounded"
    >
      Remove
    </button>
  </div>
))}

          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">Save</button>
        </form>
      </div>
    </Layout>
  );
};

export default EditDutyChartPage;
