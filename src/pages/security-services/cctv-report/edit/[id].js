import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import { dvrData, nvrData } from '../../../../constant'; // Import DVR and NVR data

export default function EditCCTVRecord() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    cctvOperator: '',
    operationalReport: false,
    remarks: '',
    cameras: [],
  });

  const [cameraEntry, setCameraEntry] = useState({
    cameraType: 'DVR',  // DVR or NVR
    cameraName: '',
    cameraNo: '',
    cameraLocation: '',
  });

  const [operators, setOperators] = useState([]); // State for CCTV operators

  // Fetch CCTV operators
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch('/api/users/filtered?roles=Technician&departments=CCTV');
        if (!response.ok) throw new Error('Failed to fetch operators');
        const data = await response.json();
        setOperators(data || []);
      } catch (error) {
        console.error('Error fetching operators:', error);
      }
    };
    fetchOperators();
  }, []);

  // Fetch record data on page load
  useEffect(() => {
    if (id) {
      const fetchRecord = async () => {
        try {
          const convertUTCToLocal = (timeString) => {
            if (!timeString) return '';

            // Create a Date object assuming time is in UTC
            const [hours, minutes] = timeString.split(':');
            const utcDate = new Date(Date.UTC(1970, 0, 1, parseInt(hours, 10), parseInt(minutes, 10), 0));

            // Convert to local time
            return utcDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
          };

          const response = await fetch(`/api/cctv-report/${id}`);
          if (!response.ok) throw new Error('Failed to fetch record');
          const data = await response.json();


          setFormData({
            ...data,
            date: data.date || '',
            time: data.time ? convertUTCToLocal(data.time) : '', // Convert UTC to Local
            cameras: data.camera || [],
          });
          
        } catch (error) {
          console.error('Error fetching record:', error);
        }
      };
      fetchRecord();
    }
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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

  const addCamera = () => {
    const { cameraType, cameraName, cameraNo, cameraLocation } = cameraEntry;

    if (!cameraType.trim() || !cameraName.trim() || !cameraNo.trim() || !cameraLocation.trim()) {
      alert('Please fill in all camera details.');
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      cameras: [...prevData.cameras, { cameraType, cameraName, cameraNo, cameraLocation }],
    }));

    setCameraEntry({ cameraType: 'DVR', cameraName: '', cameraNo: '', cameraLocation: '' });
  };

  const removeCamera = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      cameras: prevData.cameras.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      date: formData.date,
      time: formData.time,
      cctvOperator: formData.cctvOperator,
      operationalReport: formData.operationalReport,
      remarks: formData.remarks,
      cameras: formData.cameras,
    };

    try {
      const response = await fetch(`/api/cctv-report/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        router.push('/security-services/cctv-report');
      } else {
        console.error('Failed to update CCTV record');
      }
    } catch (error) {
      console.error('Error updating CCTV record:', error);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Edit CCTV Record</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

            <div>
              <label className="block font-semibold mb-1">Operational Report</label>
              <input
                type="checkbox"
                name="operationalReport"
                checked={formData.operationalReport}
                onChange={(e) => handleFormChange({ target: { name: 'operationalReport', value: e.target.checked } })}
                className="mr-2"
              />
              Yes
            </div>

            <div>
              <label className="block font-semibold mb-1">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks || ''}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Camera Management */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
              {(cameraEntry.cameraType === 'DVR' ? Object.keys(dvrData) : Object.keys(nvrData)).map((cameraName, index) => (
                <option key={index} value={cameraName}>
                  {cameraName}
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
              {(cameraEntry.cameraType === 'DVR' ? dvrData : nvrData)?.[cameraEntry.cameraName]?.cameras?.map((camera, index) => (
                <option key={index} value={camera.no}>
                  {camera.no}
                </option>
              ))}
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
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Camera
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
}
