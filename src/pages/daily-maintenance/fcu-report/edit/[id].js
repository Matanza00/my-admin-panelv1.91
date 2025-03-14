import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const EditFCUReport = ({ fcuReport }) => {
  const [report, setReport] = useState(fcuReport || null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [technicians, setTechnicians] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
    // Define floor options (1 to 19)
    const [floorOptions] = useState(["Ground", ...Array.from({ length: 19 }, (_, i) => (i + 1).toString())]);


  useEffect(() => {
    if (!report) {
      router.push('/404');
    }
  }, [report, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const techRes = await fetch(
          '/api/users/filtered?roles=Technician&departments=HVAC'
        );
        const techData = await techRes.json();
        setTechnicians(techData);

        const supRes = await fetch(
          '/api/users/filtered?roles=Supervisor&departments=HVAC'
        );
        const supData = await supRes.json();
        setSupervisors(supData);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Fetched Report Data:", report);
  }, [report]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleFloorChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFloorFCs = [...report.floorFCs];
    updatedFloorFCs[index] = {
      ...updatedFloorFCs[index],
      [name]: value,
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

    // Validate floorFCs
  const isValid = report.floorFCs.every((floorFC) => floorFC.floorFrom && floorFC.floorTo);
  if (!isValid) {
    alert("Floor From and Floor To cannot be empty.");
    setLoading(false);
    return;
  }

    try {
      const res = await fetch(`/api/fcu-reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (res.ok) {
        router.push(`/daily-maintenance/fcu-report/view/${id}`);
      } else {
        console.error('Failed to update FCU report');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!report) {
    return <p>Loading...</p>;
  }

  return (<Layout>
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Edit FCU Report</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* Report Information */}
        <div>
            <label className="block text-lg font-medium text-gray-900">Date</label>
            <input
              type="date"
              name="date"
              value={report.date ? report.date.slice(0, 10) : ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

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

        {/* Approval Status
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-900">Supervisor Approval</label>
            <select
              name="supervisorApproval"
              value={report.supervisorApproval ? 'true' : 'false'}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900">Engineer Approval</label>
            <select
              name="engineerApproval"
              value={report.engineerApproval ? 'true' : 'false'}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div> */}

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
                      value={floorFC.floorFrom || ""}
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
                  value={floorFC.floorTo || ""}
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
  {/* Attended By Dropdown */}
  <div>
    <label className="block text-lg font-medium text-gray-900">Attended By</label>
    <select
      name="attendedBy"
      value={floorFC.attendedBy || ""}
      onChange={(e) => handleFloorChange(e, index)}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="">{floorFC.attendedBy}</option>
      {technicians.map((technician) => (
        <option key={technician.id} value={technician.id}>
          {technician.name}
        </option>
      ))}
    </select>
  </div>

  {/* Verified By Dropdown */}
  <div>
    <label className="block text-lg font-medium text-gray-900">Verified By</label>
    <select
      name="verifiedBy"
      value={floorFC.verifiedBy || ""}
      onChange={(e) => handleFloorChange(e, index)}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="">{floorFC.verifiedBy}</option>
      {supervisors.map((supervisor) => (
        <option key={supervisor.id} value={supervisor.id}>
          {supervisor.name}
        </option>
      ))}
    </select>
  </div>
</div>


              {/* Remove floor button */}
              {/* <button
                type="button"
                onClick={() => removeFloor(index)}
                className="text-red-600 mt-2 hover:text-red-800"
              >
                Remove Floor
              </button> */}
            </div>
          ))}

          {/* Add new floor button */}
          {/* <button
            type="button"
            onClick={addFloor}
            className="text-green-600 mt-4 hover:text-green-800"
          >
            Add New Floor
          </button> */}
        </div>

        {/* Approval Status */}
        <label className="block text-lg font-medium text-gray-900 pt-4 mb-2">Status</label>
        <div className="grid grid-cols-2 gap-4 items-center">
        
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">Supervisor</label>
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
                <label className="block text-lg font-medium text-gray-900 mb-2">Engineer</label>
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
          {loading ? 'Updating...' : 'Update Report'}
        </button>
      </form>
    </div></Layout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/fcu-reports/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch report with ID ${id}`);

    const fcuReport = await res.json();
    return { props: { fcuReport } };
  } catch (error) {
    console.error('Error in getServerSideProps:', error.message);
    return { notFound: true };
  }
}

export default EditFCUReport;
