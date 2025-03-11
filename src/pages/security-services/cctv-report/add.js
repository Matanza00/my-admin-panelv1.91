import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout'; // Adjust path to your Layout component
import { dvrData, nvrData } from '../../../constant'; // Import DVR and NVR data

export default function AddCCTVReport() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    cctvOperator: '',
    operationalReport: false,
    remarks: '',
    cameras: [],
  });

  const [cameraEntry, setCameraEntry] = useState({
    cameraType: 'DVR',
    cameraName: '',
    cameraNo: '',
    cameraLocation: '',
  });

  const [operators, setOperators] = useState([]); // State for CCTV Operators
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

  // Fetch CCTV operators
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch(
          '/api/users/filtered?roles=Technician&departments=CCTV'
        );
        const data = await response.json();
        setOperators(data || []);
      } catch (error) {
        console.error('Error fetching operators:', error);
      }
    };
    fetchOperators();
  }, []);

  // Handle form field changes (Date, Time, Operator, Remarks)
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle camera-related field changes
  const handleCameraChange = (e) => {
    const { name, value } = e.target;
    setCameraEntry((prevData) => {
      const updatedEntry = { ...prevData, [name]: value };

      if (name === 'cameraNo' && value) {
        const selectedData = cameraEntry.cameraType === 'DVR' ? dvrData : nvrData;
        const selectedCamera = selectedData[cameraEntry.cameraName]?.cameras?.find(
          (camera) => camera.no === value
        );

        if (selectedCamera) {
          updatedEntry.cameraLocation = selectedCamera.location; // Auto-populate location
        }
      }

      return updatedEntry;
    });
  };

  // Add camera to the list of cameras
  const addCamera = () => {
    const { cameraType, cameraName, cameraNo, cameraLocation } = cameraEntry;

    if (!cameraType || !cameraName || !cameraNo || !cameraLocation) {
      alert('Please fill in all camera details.');
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      cameras: [...prevData.cameras, { cameraType, cameraName, cameraNo, cameraLocation }],
    }));

    // Reset camera entry fields
    setCameraEntry({ cameraType: 'DVR', cameraName: '', cameraNo: '', cameraLocation: '' });
  };

  // Remove camera from the list
  const removeCamera = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      cameras: prevData.cameras.filter((_, i) => i !== index),
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      date: formData.date,
      time: formData.time,
      cctvOperator: parseInt(formData.cctvOperator, 10), // Convert to integer
      operationalReport: formData.operationalReport,
      remarks: formData.remarks,
      cameras: formData.cameras,
    };

    try {
      const response = await fetch('/api/cctv-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...reportData, createdById: userId }), // Include createdById
      });

      if (response.ok) {
        alert('CCTV report created successfully!');
        setFormData({
          date: '',
          time: '',
          cctvOperator: '',
          operationalReport: false,
          remarks: '',
          cameras: [],
        });
        router.push('/security-services/cctv-report');
      } else {
        console.error('Failed to create CCTV report');
      }
    } catch (error) {
      console.error('Error creating CCTV report:', error);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">Add CCTV Report</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">CCTV Operator</label>
              <select
                name="cctvOperator"
                value={formData.cctvOperator}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="">Select Operator</option>
                {operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="operationalReport"
                checked={formData.operationalReport}
                onChange={handleFormChange}
                className="mr-2"
              />
              <label className="font-semibold">Operational Report</label>
            </div>

            <div>
              <label className="block font-semibold mb-1">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Camera Management */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Cameras</h2>
            {formData.cameras.length > 0 && (
              <div className="mb-6">
                {formData.cameras.map((camera, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center">
                    <div>
                      <p><strong>Type:</strong> {camera.cameraType}</p>
                      <p><strong>Name:</strong> {camera.cameraName}</p>
                      <p><strong>Number:</strong> {camera.cameraNo}</p>
                      <p><strong>Location:</strong> {camera.cameraLocation}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCamera(index)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Camera Entry Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="cameraType"
                value={cameraEntry.cameraType}
                onChange={handleCameraChange}
                className="border border-gray-300 rounded-lg p-2"
              >
                <option value="DVR">DVR</option>
                <option value="NVR">NVR</option>
              </select>

              <select
                name="cameraName"
                value={cameraEntry.cameraName}
                onChange={handleCameraChange}
                className="border border-gray-300 rounded-lg p-2"
                disabled={!cameraEntry.cameraType}
              >
                <option value="">Select Camera</option>
                {(cameraEntry.cameraType === 'DVR'
                  ? Object.keys(dvrData)
                  : Object.keys(nvrData)
                ).map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                name="cameraNo"
                value={cameraEntry.cameraNo}
                onChange={handleCameraChange}
                className="border border-gray-300 rounded-lg p-2"
                disabled={!cameraEntry.cameraName}
              >
                <option value="">Select Camera Number</option>
                {(cameraEntry.cameraType === 'DVR' ? dvrData : nvrData)?.[cameraEntry.cameraName]?.cameras?.map(
                  (camera, index) => (
                    <option key={index} value={camera.no}>
                      {camera.no}
                    </option>
                  )
                )}
              </select>

              <input
                type="text"
                name="cameraLocation"
                value={cameraEntry.cameraLocation}
                className="border border-gray-300 rounded-lg p-2"
                readOnly
                placeholder="Camera Location"
              />
            </div>
            <button
              type="button"
              onClick={addCamera}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Add Camera
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Save Report
          </button>
        </form>
      </div>
    </Layout>
  );
}
