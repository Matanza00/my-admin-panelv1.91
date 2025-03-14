import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';

const AddFCUReport = () => {
  const [report, setReport] = useState({
    remarks: '',
    supervisorApproval: false,
    engineerApproval: false,
    floorFCs: [{ floorFrom: '', floorTo: '', details: '', attendedBy: '', verifiedBy: '' }]
  });
  
  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [floorOptions] = useState(["Ground", ...Array.from({ length: 19 }, (_, i) => (i + 1).toString())]);
  const router = useRouter();
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

   // Fetch Technicians and Supervisors
   useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch technicians
        const technicianRes = await fetch(
          "/api/users/filtered?roles=Technician&departments=HVAC"
        );
        const technicianData = await technicianRes.json();
        setTechnicians(technicianData);

        // Fetch supervisors
        const supervisorRes = await fetch(
          "/api/users/filtered?roles=Supervisor&departments=HVAC"
        );
        const supervisorData = await supervisorRes.json();
        setSupervisors(supervisorData);
      } catch (error) {
        console.error("Error fetching Technicians or Supervisors:", error);
      }
    };

    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleFloorChange = (e, index) => {
    const { name, value } = e.target;
  
    console.log(`🟡 Selected ${name} for FloorFC Index ${index}:`, value);
  
    const updatedFloorFCs = [...report.floorFCs];
    updatedFloorFCs[index] = {
      ...updatedFloorFCs[index],
      [name]: value, // Ensure the ID is stored
    };
  
    setReport((prevReport) => ({
      ...prevReport,
      floorFCs: updatedFloorFCs,
    }));
  };
  

  const addFloor = () => {
    setReport((prevReport) => ({
      ...prevReport,
      floorFCs: [
        ...prevReport.floorFCs,
        { floorFrom: '', floorTo: '', details: '', attendedBy: '', verifiedBy: '' },
      ],
    }));
  };

  const removeFloor = (index) => {
    const updatedFloorFCs = report.floorFCs.filter((_, i) => i !== index);
    setReport((prevReport) => ({
      ...prevReport,
      floorFCs: updatedFloorFCs,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/fcu-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...report, createdById: userId }), // Include createdById
      });

      if (res.ok) {
        router.push('/daily-maintenance/fcu-report');
      } else {
        console.error('Failed to create FCU report');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Add FCU Report</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Report Information */}


          <div>
            <label className="block text-lg font-medium text-gray-900">Remarks</label>
            <textarea
              name="remarks"
              value={report.remarks}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
          </div>



          {/* Floor FC Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Floor FC Details</h3>
            {report.floorFCs.map((floorFC, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-medium text-gray-900">Floor From</label>
                    <select
                      name="floorFrom"
                      value={floorFC.floorFrom}
                      onChange={(e) => handleFloorChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Floor</option>
                      {floorOptions.map((floor) => (
                        <option key={floor} value={floor}>
                          Floor {floor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-900">Floor To</label>
                    <select
                      name="floorTo"
                      value={floorFC.floorTo}
                      onChange={(e) => handleFloorChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Floor</option>
                      {floorOptions.map((floor) => (
                        <option key={floor} value={floor}>
                          Floor {floor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900">Details</label>
                  <textarea
                    name="details"
                    value={floorFC.details}
                    onChange={(e) => handleFloorChange(e, index)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <select
                  name="attendedBy"
                  value={floorFC.attendedBy}
                  onChange={(e) => handleFloorChange(e, index)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Technician</option>
                  {technicians.map((technician) => (
                    <option key={technician.id} value={technician.id}>
                      {technician.name}
                    </option>
                  ))}
                </select>

                <select
  name="verifiedBy"
  value={floorFC.verifiedBy}
  onChange={(e) => handleFloorChange(e, index)}
  className="w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">Select Supervisor</option>
  {supervisors.map((supervisor) => (
    <option key={supervisor.id} value={supervisor.id}>
      {supervisor.name}
    </option>
  ))}
</select>

                </div>

                {/* Remove floor button */}
                <button
                  type="button"
                  onClick={() => removeFloor(index)}
                  className="text-red-600 mt-2 hover:text-red-800"
                >
                  Remove Floor
                </button>
              </div>
            ))}

            {/* Add new floor button */}
            <button
              type="button"
              onClick={addFloor}
              className="text-green-600 mt-4 hover:text-green-800"
            >
              Add New Floor
            </button>
          </div>
          {/* Approval Status */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">Supervisor Approval</label>
                <select
                  name="supervisorApproval"
                  value={report.supervisorApproval ? "true" : "false"}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="true" className="bg-green-100 text-green-700">Yes</option>
                  <option value="false" className="bg-red-100 text-red-700">No</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">Engineer Approval</label>
                <select
                  name="engineerApproval"
                  value={report.engineerApproval ? "true" : "false"}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="true" className="bg-green-100 text-green-700">Yes</option>
                  <option value="false" className="bg-red-100 text-red-700">No</option>
                </select>
              </div>
            </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white bg-blue-600 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Add Report'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddFCUReport;
