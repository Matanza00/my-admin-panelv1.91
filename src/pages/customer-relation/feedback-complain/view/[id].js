import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import FeedbackReviewModal from '../../../../components/FeedbackReviewModal';
import { useSession } from 'next-auth/react';
import Rating from '@mui/material/Rating';


export default function ViewFeedbackComplain() {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL parameters
  const [complainData, setComplainData] = useState(null);
  const [slips, setSlips] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    complaintDesc: '',
    materialReq: '',
    actionTaken: '',
    attendedById: '', // Initialize as an empty string
    remarks: '',
    status: 'Pending',
    departmentId: '',
  });

  const { data: session } = useSession();

  useEffect(() => {
    if (!id) return; // Ensure ID is available before making API call

    const fetchData = async () => {
      try {
        // Fetch complain data
        const complainResponse = await fetch(`/api/feedbackcomplain/${id}`);
        const complainData = await complainResponse.json();

        if (complainResponse.ok) {
          setComplainData(complainData);
          setSlips(complainData.jobSlips || []);
        } else {
          console.error('Failed to fetch complain data');
        }

        // Fetch departments
        const departmentsResponse = await fetch('/api/departments');
        if (departmentsResponse.ok) {
          const departmentsData = await departmentsResponse.json();
          setDepartments(departmentsData || []);
        } else {
          console.error('Failed to fetch departments');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

const [showFeedbackModal, setShowFeedbackModal] = useState(false);
const [feedbackExists, setFeedbackExists] = useState(false);
const [feedbackReview, setFeedbackReview] = useState(null);

useEffect(() => {
  if (slips.length > 0 && complainData) {
    const allClosed = slips.every((slip) => slip.status === "Verified & Closed");

    if (!allClosed) {
      setShowFeedbackModal(false);
      return;
    }

    // ✅ Use the already loaded feedbackReview from complainData
    if (complainData.feedbackReview) {
      setFeedbackExists(true);
      setFeedbackReview(complainData.feedbackReview);
      setShowFeedbackModal(false); // Don't show modal again
    } else {
      setFeedbackExists(false);
      setFeedbackReview(null);
      setShowFeedbackModal(true); // Show modal to allow feedback submission
    }
  }
}, [slips, complainData]);


const [technicians, setTechnicians] = useState([]);



const handleDepartmentChange = async (e) => {
  const departmentId = e.target.value;
  const departmentName = departments.find(dep => dep.id === parseInt(departmentId))?.name;

  setFormData({ ...formData, departmentId, attendedById: '' });

  try {
    const [technicianRes, supervisorRes] = await Promise.all([
      fetch(`/api/users/filtered?roles=technician&departments=${departmentName}`),
      fetch(`/api/users/filtered?roles=supervisor&departments=${departmentName}`)
    ]);

    if (technicianRes.ok && supervisorRes.ok) {
      const technicianData = await technicianRes.json();
      const supervisorData = await supervisorRes.json();

      // You can store them separately if you like:
      setTechnicians(technicianData || []);
      setSupervisors(supervisorData || []);
    } else {
      console.error('Failed to fetch technician or supervisor');
    }
  } catch (error) {
    console.error('Error fetching technician or supervisor:', error);
  }
};

  const handleChange = (e) => {
    const { name, value, options } = e.target;
  
    if (name === 'attendedById') {
      const selectedValues = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value)
        .join(','); // Join selected values into a string
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  

  const handleAddJobSlip = async () => {
    try {
      const token = session?.user?.accessToken;

    if (!token) {
      // Show warning if user is not logged in or token is expired
      alert("You are not logged in. Please log in to submit the job slip.");
      return;
    }
      if (!formData || !complainData) {
        console.error("formData or complainData is missing:", { formData, complainData });
        return;
      }
  
      const todayDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
  
      console.log("Sending Request with Data:", {
        date: formData.date ? formData.date : todayDate, // Set today's date if empty
        complaintDesc: formData.complaintDesc || "",
        materialReq: formData.materialReq || "",
        actionTaken: formData.actionTaken || "",
        attendedBy: formData.attendedById || "",
        remarks: formData.remarks || "",
        status: formData.status || "Pending",
        department: formData.departmentId || "",
        complainNo: complainData.complainNo || "",
        complainBy: complainData.complainBy || "N/A",
        floorNo: complainData.floorNo || "",
        area: complainData.area || "",
        location: complainData.locations || "",
        // locations: complainData.locations || "",
      });
  
      const response = await fetch("/api/job-slip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
        body: JSON.stringify({
          date: formData.date ? formData.date : todayDate, // Use today's date if empty
          complaintDesc: formData.complaintDesc || "",
          materialReq: formData.materialReq || "",
          actionTaken: formData.actionTaken || "",
          attendedBy: formData.attendedById || "",
          remarks: formData.remarks || "",
          status: formData.status || "Pending",
          department: formData.departmentId || "",
          complainNo: complainData.complainNo || "",
          complainBy: complainData.complainBy || "N/A",
          floorNo: complainData.floorNo || "",
          area: complainData.area || "",
          location: complainData.locations || "",
          // locations: complainData.locations || "",
        }),
      });
  
      if (!response.ok) throw new Error("Failed to add job slip");
  
      const newSlip = await response.json();
      setSlips((prev) => [...prev, newSlip]);
  
      setFormData({
        date: "",
        complaintDesc: "",
        materialReq: "",
        actionTaken: "",
        attendedById: "",
        remarks: "",
        status: "",
        departmentId: "",
      });
  
    } catch (error) {
      console.error("Error adding job slip:", error.message);
    }
  };
  

  const handleDeleteJobSlip = async (id) => {
    try {
      const response = await fetch(`/api/job-slip/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete job slip');

      setSlips((prev) => prev.filter((slip) => slip.id !== id));
    } catch (error) {
      console.error('Error deleting job slip:', error.message);
    }
  };

  const handleUpdateMaterialSent = async (slipId, newMaterialSent) => {
    try {
      if (!session.user.accessToken) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch(`/api/job-slip/inventory/${slipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ inventoryRecieptNo: newMaterialSent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update material sent');
      }

      // const updatedSlip = await response.json();

      // Update the local slips state with the updated status and MIF No
      setSlips((prev) =>
        prev.map((slip) =>
          slip.id === slipId ? { ...slip, inventoryRecieptNo: newMaterialSent, status: 'InProgress' } : slip
        )
      );
    } catch (error) {
      console.error('Error updating material sent:', error.message);
    }
  };

  if (!complainData) return <div>Loading...</div>;


  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Feedback/Complain Details</h1>

        {/* Feedback Details */}
<div className="bg-white shadow-md rounded p-4 mb-6">
  <h2 className="text-lg font-medium mb-4">Complain Information</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {complainData?.tenant?.tenantName && (
      <div className="text-sm">
        <strong>Tenant Name:</strong> {complainData.tenant.tenantName}
      </div>
    )}
    {Object.entries(complainData || {}).map(([key, value]) => {
      if (key === 'date' || ['createdAt', 'updatedAt'].includes(key)) {
        const date = new Date(value);

        // Format date as DD/MM/YYYY
        const formattedDate = date.toLocaleDateString('en-GB');

        // Format time as HH/MM/SS
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}/${String(
          date.getMinutes()
        ).padStart(2, '0')}/${String(date.getSeconds()).padStart(2, '0')}`;

        return (
          <div key={key} className="text-sm">
            <strong className="capitalize">
              {key.replace(/([A-Z])/g, ' $1')}:
            </strong>{' '}
            {formattedDate} 
          </div>
        );
      }

    // If it's an object, don't render it directly
    if (typeof value === 'object') {
      return (
        <div key={key} className="text-sm">
          <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> Object data
        </div>
      );
    }

    return (
      <div key={key} className="text-sm">
        <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
      </div>
    );
  })}

          </div>
        </div>
        
        {feedbackExists && feedbackReview && (
  <div className="mb-6">
    <div className="bg-white shadow-2xl rounded-lg p-6 border border-gray-200 transform transition-all duration-300 hover:scale-[1.01]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Feedback </h2>
      <div className="mb-2">
      <h2 className="text-lg font-medium text-gray-600 mb-4"> {complainData.tenant} </h2>
      </div>

      <div className="flex items-center space-x-4 mb-2">
        <span className="text-lg font-medium text-gray-600">Rating:</span>
        <Rating
          name="read-only-rating"
          value={feedbackReview.rating}
          precision={0.5}
          readOnly
        />
        <span className="text-sm text-gray-500">{feedbackReview.rating} / 5</span>
      </div>

      <div className="mb-2">
        <span className="text-lg font-medium text-gray-600">Satisfied:</span>{' '}
        <span className={`ml-2 font-semibold ${feedbackReview.satisfied ? 'text-green-600' : 'text-red-600'}`}>
          {feedbackReview.satisfied ? 'Yes' : 'No'}
        </span>
      </div>
      

      {feedbackReview.comments && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700 mb-1">Comments:</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{feedbackReview.comments}</p>
        </div>
      )}
    </div>
  </div>
)}


        {showFeedbackModal && !feedbackExists && (
  <FeedbackReviewModal
    open={true}
    feedbackComplainId={complainData.id}
    onClose={() => setShowFeedbackModal(false)}
  />
)}



        {/* Job Slips Section */}
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">Job Slips</h2>
          {slips.length > 0 ? (
            <table className="table-auto w-full text-sm text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Technician</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">MIF No</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{new Date(slip.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{slip.complaintDesc}</td>
                    <td className="border px-4 py-2">{slip.attendedBy?slip.attendedBy.split(',').join(', '):''}</td>
                    <td className="border px-4 py-2">{slip.status}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        placeholder='MIFNo'
                        value={slip.inventoryRecieptNo || ''}
                        onChange={(e) => {
                          const updatedSlips = slips.map((s) =>
                            s.id === slip.id ? { ...s, inventoryRecieptNo: e.target.value } : s
                          );
                          setSlips(updatedSlips);
                        }}
                        className=" border rounded px-2 py-1"
                      />

{(session?.user.role.toLowerCase() === 'super_admin' || session?.user.role.toLowerCase() === 'supervisor'|| session?.user.role.toLowerCase() === 'bookkeeper') && (
  
                      <button
                        onClick={() =>
                          handleUpdateMaterialSent(slip.id, slip.inventoryRecieptNo)
                        }
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
  
)}
                      </td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => router.push(`/customer-relation/job-slip/view/${slip.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => router.push(`/customer-relation/job-slip/edit/${slip.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteJobSlip(slip.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">No job slips available.</p>
          )}
        </div>

        {/* Add Job Slip Section */}
        {(session?.user.role.toLowerCase() === 'super_admin' || session?.user.role.toLowerCase() === 'admin' || session?.user.role.toLowerCase() === 'supervisor') && (
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-lg font-medium mb-4">Add New Job Slip</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block font-medium mb-1">
                  Department
                </label>
                <select
                  id="department"
                  onChange={handleDepartmentChange}
                  className="w-full border rounded px-2 py-1"
                  value={formData.departmentId}
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Technicians Dropdown */}
<div>
  <label htmlFor="technicians" className="block font-medium mb-1">Technicians</label>
  <select
    id="technicians"
    multiple
    className="w-full border rounded px-2 py-1"
    onChange={(e) => {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      const existing = formData.attendedById ? formData.attendedById.split(',') : [];
      const others = existing.filter(id => !supervisors.some(s => s.id.toString() === id));
      const updated = [...new Set([...others, ...selected])];
      setFormData({ ...formData, attendedById: updated.join(',') });
    }}
    value={
      formData.attendedById
        ? formData.attendedById.split(',').filter(id => technicians.some(t => t.id.toString() === id))
        : []
    }
  >
    {technicians.map((tech) => (
      <option key={tech.id} value={tech.id}>{tech.name}</option>
    ))}
  </select>
</div>

{/* Supervisors Dropdown */}
<div>
  <label htmlFor="supervisors" className="block font-medium mb-1">Supervisors</label>
  <select
    id="supervisors"
    multiple
    className="w-full border rounded px-2 py-1"
    onChange={(e) => {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      const existing = formData.attendedById ? formData.attendedById.split(',') : [];
      const others = existing.filter(id => !technicians.some(t => t.id.toString() === id));
      const updated = [...new Set([...others, ...selected])];
      setFormData({ ...formData, attendedById: updated.join(',') });
    }}
    value={
      formData.attendedById
        ? formData.attendedById.split(',').filter(id => supervisors.some(s => s.id.toString() === id))
        : []
    }
  >
    {supervisors.map((sup) => (
      <option key={sup.id} value={sup.id}>{sup.name}</option>
    ))}
  </select>
</div>

              {[{ label: 'Complaint Description', name: 'complaintDesc', type: 'text' },
                { label: 'Material Required', name: 'materialReq', type: 'text' },
                { label: 'Action Taken', name: 'actionTaken', type: 'text' },
                { label: 'Remarks', name: 'remarks', type: 'text' },].map((field) => (
                <div key={field.name} className="text-sm">
                  <label htmlFor={field.name} className="block font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddJobSlip}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Add Job Slip
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
