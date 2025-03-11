import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";

const EditDutyChartPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [dutyChart, setDutyChart] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [supervisors, setSupervisors] = useState([]);

  // Fetch DutyChart data when page loads
  useEffect(() => {
    if (id) {
      fetch(`/api/dutychart/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setDutyChart(data);
          setAttendance(data.attendance || []);
        });
    }
    console.log(dutyChart)
  }, [id]);

  // Fetch supervisors when the page loads
  useEffect(() => {
    fetch("http://localhost:3000/api/users/filtered?roles=supervisor&department=Building")
      .then((response) => response.json())
      .then((data) => {
        setSupervisors(data || []);
      })
      .catch((error) => console.error("Error fetching supervisors:", error));
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
    const newAttendance = [...attendance];
    newAttendance.splice(index, 1);
    setAttendance(newAttendance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let pictureUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        pictureUrl = `/uploads/${result.filename}`;
      } else {
        alert("Image upload failed");
      }
    }

    
    const requestBody = {
      id: dutyChart.id,
      date: dutyChart.date,
      supervisor: dutyChart.supervisor, // Send supervisor ID
      remarks: dutyChart.remarks,
      picture: pictureUrl || dutyChart.picture,
      attendance: attendance,
    };
    console.log(requestBody)
    const response = await fetch(`/api/dutychart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      alert("Duty chart updated successfully");
      router.push("/general-administration/duty-chart");
    } else {
      alert("Error updating duty chart");
    }
  };
 
  

  if (!dutyChart) return <div>Loading...</div>;
  console.log(dutyChart.supervisor
  )
  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4">
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
              value={dutyChart.supervisor}
              onChange={(e) => setDutyChart({ ...dutyChart, supervisor: e.target.value })}
            >
              <option value="">{dutyChart.supervisor}</option>
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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {imagePreview ? (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto max-w-[300px] rounded"
                />
              </div>
            ) : dutyChart.picture ? (
              <div className="mt-2">
                <img
                  src={dutyChart.picture}
                  alt="Current Duty Chart Picture"
                  className="w-full h-auto max-w-[300px] rounded"
                />
              </div>
            ) : (
              <div className="mt-2 text-gray-500">No image found</div>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Attendance</h2>
            {attendance.map((att, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <input
                  type="text"
                  value={att.name || ""}
                  onChange={(e) => handleAttendanceChange(index, "name", e.target.value)}
                  placeholder="Name"
                  className="p-2 border rounded w-1/6"
                />
                <input
                  type="text"
                  value={att.designation || ""}
                  onChange={(e) => handleAttendanceChange(index, "designation", e.target.value)}
                  placeholder="Designation"
                  className="p-2 border rounded w-1/6"
                />
                <input
                  type="datetime-local"
                  value={(att.timeIn || "").slice(0, 16)}
                  onChange={(e) => handleAttendanceChange(index, "timeIn", e.target.value)}
                  className="p-2 border rounded w-1/6"
                />
                <input
                  type="datetime-local"
                  value={(att.timeOut || "").slice(0, 16)}
                  onChange={(e) => handleAttendanceChange(index, "timeOut", e.target.value)}
                  className="p-2 border rounded w-1/6"
                />
                <input
                  type="datetime-local"
                  value={(att.lunchIn || "").slice(0, 16)}
                  onChange={(e) => handleAttendanceChange(index, "lunchIn", e.target.value)}
                  className="p-2 border rounded w-1/6"
                />
                <input
                  type="datetime-local"
                  value={(att.lunchOut || "").slice(0, 16)}
                  onChange={(e) => handleAttendanceChange(index, "lunchOut", e.target.value)}
                  className="p-2 border rounded w-1/6"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttendance(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAttendance}
              className="bg-green-500 text-white p-2 rounded mt-2"
            >
              Add Attendance
            </button>
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
            Save
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditDutyChartPage;
