import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";

const AddDutyChartPage = () => {
  const router = useRouter();
  const [dutyChart, setDutyChart] = useState({
    date: "",
    supervisor: "",
    remarks: "",
  });
  const [attendance, setAttendance] = useState([]);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [usersByDepartment, setUsersByDepartment] = useState({});

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

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          "/api/users/filtered?roles=Supervisor&departments=Building"
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

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (response.ok) {
          const result = await response.json();
          setDepartments(result || []);
        } else {
          console.error("Error fetching departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const fetchUsersByDepartment = async (department, index) => {
    try {
      const response = await fetch(`/api/users/filtered?departments=${department}`);
      if (response.ok) {
        const result = await response.json();
        const updatedUsersByDepartment = { ...usersByDepartment };
        updatedUsersByDepartment[index] = result || [];
        setUsersByDepartment(updatedUsersByDepartment);
      } else {
        console.error("Error fetching users for department");
      }
    } catch (error) {
      console.error("Error fetching users for department:", error);
    }
  };

  const handleAddAttendance = () => {
    setAttendance([
      ...attendance,
      {
        id: Date.now(),
        department: "",
        name: "",
        designation: "",
        timeIn: "",
        timeOut: "",
        lunchIn: "",
        lunchOut: "",
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
        return;
      }
    }

    const requestBody = {
      date: dutyChart.date,
      supervisor: dutyChart.supervisor,
      remarks: dutyChart.remarks,
      picture: pictureUrl,
      attendance,
    };
    console.log(requestBody);

    const response = await fetch("/api/dutychart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      alert("Duty chart added successfully");
      router.push("/general-administration/duty-chart");
    } else {
      alert("Error adding duty chart");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Add Duty Chart</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="datetime-local"
              value={dutyChart.date}
              onChange={(e) => setDutyChart({ ...dutyChart, date: e.target.value })}
              className="w-full p-2 border rounded text-sm md:text-base"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Supervisor</label>
            <select
              className="w-full p-2 border rounded text-sm md:text-base"
              value={dutyChart.supervisor}
              onChange={(e) => setDutyChart({ ...dutyChart, supervisor: e.target.value })}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={dutyChart.remarks}
              onChange={(e) => setDutyChart({ ...dutyChart, remarks: e.target.value })}
              className="w-full p-2 border rounded text-sm md:text-base"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded text-sm md:text-base"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-full max-w-xs rounded" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Attendance</h2>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Department</th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Time In</th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Time Out</th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Lunch In</th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Lunch Out</th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att, index) => (
                    <tr key={att.id} className="text-center">
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <select
                          className="w-full p-2 border rounded"
                          value={att.department}
                          onChange={(e) => {
                            handleAttendanceChange(index, "department", e.target.value);
                            fetchUsersByDepartment(e.target.value, index);
                          }}
                        >
                          <option value="">Select Department</option>
                          {departments.map((department) => (
                            <option key={department.id} value={department.name}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <select
                          className="w-full p-2 border rounded"
                          value={att.name}
                          onChange={(e) => handleAttendanceChange(index, "name", e.target.value)}
                        >
                          <option value="">Select Name</option>
                          {(usersByDepartment[index] || []).map((user) => (
                            <option key={user.id} value={user.name}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <input
                          type="datetime-local"
                          value={att.timeIn}
                          onChange={(e) => handleAttendanceChange(index, "timeIn", e.target.value)}
                          className="p-2 border rounded w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <input
                          type="datetime-local"
                          value={att.timeOut}
                          onChange={(e) => handleAttendanceChange(index, "timeOut", e.target.value)}
                          className="p-2 border rounded w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <input
                          type="datetime-local"
                          value={att.lunchIn}
                          onChange={(e) => handleAttendanceChange(index, "lunchIn", e.target.value)}
                          className="p-2 border rounded w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <input
                          type="datetime-local"
                          value={att.lunchOut}
                          onChange={(e) => handleAttendanceChange(index, "lunchOut", e.target.value)}
                          className="p-2 border rounded w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveAttendance(index)}
                          className="bg-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={handleAddAttendance}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Attendance
            </button>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full md:w-auto">
            Add Duty Chart
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddDutyChartPage;
