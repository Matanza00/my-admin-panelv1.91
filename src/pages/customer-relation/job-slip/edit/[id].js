import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import prisma from '../../../../lib/prisma';
import { useSession } from 'next-auth/react'; // Import session handler

export default function EditJobSlip({ jobSlip }) {
  const router = useRouter();

  // State to hold form data for editable fields
  const { data: session } = useSession();

  const [canApprove, setCanApprove] = useState(false);

  // Ensure session data is handled asynchronously
  useEffect(() => {
    if (session?.user) {
      const userRoles = session.user.role?.toLowerCase() || '';
      const userDepartment = session.user.department?.toLowerCase() || '';

      const approvalPermission =
        userRoles === 'super_admin' ||
        userRoles === 'admin' ||
        userRoles === 'manager' ||
        (userRoles === 'supervisor' && userDepartment === 'building');

      setCanApprove(approvalPermission);
    }
  }, [session]);


  const [formData, setFormData] = useState({
    jobId: jobSlip.jobId,
    complainNo: jobSlip.complainNo,
    complainBy: jobSlip.complainBy,
    complainDesc: jobSlip.complainDesc,
    materialReq: jobSlip.materialReq,
    actionTaken: jobSlip.actionTaken,
    attendedBy: jobSlip.attendedBy,
    remarks: jobSlip.remarks,
    status: jobSlip.status,
    date: jobSlip.date,
    floorNo: jobSlip.floorNo,
    area: jobSlip.area,
    location: jobSlip.location,
    completedAt: jobSlip.completedAt,
    supervisorApproval: jobSlip.supervisorApproval, // Add supervisor approval
    managementApproval: jobSlip.managementApproval,
    picture: jobSlip.picture ? jobSlip.picture.split(',').map(url => url.trim()) : [],
  });

  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle toggle switches separately
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let pictureUrls = [];

    for (let i = 0; i < files.length; i++) {
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', files[i]);

      try {
        const uploadResponse = await fetch('/api/job-slip/upload', {
          method: 'POST',
          body: formDataToUpload,
        });

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          pictureUrls.push(`/uploads/slips/${result.filename}`);
        } else {
          alert(`Image upload failed for file ${files[i].name}`);
          return;
        }
      } catch (error) {
        console.error(`Error uploading file ${files[i].name}:`, error);
      }
    }

    if (files.length === 0) {
      pictureUrls = formData.picture;
    }

    const updatedFormData = { ...formData, picture: pictureUrls.join(', ') };

    console.log('Request Body:', updatedFormData); // Log the request body

    try {
      const response = await fetch(`/api/job-slip/${jobSlip.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        router.push(`/customer-relation/job-slip/view/${jobSlip.id}`);
      } else {
        console.error('Error updating job slip');
      }
    } catch (error) {
      console.error('Error updating job slip:', error);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Job Slip</h1>

        {/* Job Slip Edit Form */}
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display all fields, but only make these editable */}
              <div className="text-sm">
                <label htmlFor="jobId" className="block font-medium mb-1">
                  Job ID
                </label>
                <input
                  id="jobId"
                  name="jobId"
                  type="text"
                  value={formData.jobId}
                  disabled // Non-editable
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="complainNo" className="block font-medium mb-1">
                  Complain Number
                </label>
                <input
                  id="complainNo"
                  name="complainNo"
                  type="text"
                  value={formData.complainNo}
                  disabled // Non-editable
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="complainBy" className="block font-medium mb-1">
                  Complain By
                </label>
                <input
                  id="complainBy"
                  name="complainBy"
                  type="text"
                  value={formData.complainBy}
                  disabled // Non-editable
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="complainDesc" className="block font-medium mb-1">
                  Complaint Description
                </label>
                <input
                  id="complainDesc"
                  name="complainDesc"
                  type="text"
                  value={formData.complainDesc}
                  disabled // Non-editable
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="materialReq" className="block font-medium mb-1">
                  Material Required
                </label>
                <input
                  id="materialReq"
                  name="materialReq"
                  type="text"
                  value={formData.materialReq}
                  onChange={handleChange} // Editable
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="actionTaken" className="block font-medium mb-1">
                  Action Taken
                </label>
                <input
                  id="actionTaken"
                  name="actionTaken"
                  type="text"
                  value={formData.actionTaken}
                  disabled // Non-editable
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="attendedBy" className="block font-medium mb-1">
                  Attended By
                </label>
                <input
                  id="attendedBy"
                  name="attendedBy"
                  type="text"
                  value={formData.attendedBy}
                  onChange={handleChange} // Editable
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="remarks" className="block font-medium mb-1">
                  Remarks
                </label>
                <input
                  id="remarks"
                  name="remarks"
                  type="text"
                  value={formData.remarks}
                  onChange={handleChange} // Editable
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="status" className="block font-medium mb-1">
                  Status
                </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  disabled
                  onChange={handleChange} // Editable
                  className="w-full border rounded px-2 py-1  bg-gray-200"
                />
              </div>
              {/* Add Date field */}
<div className="text-sm">
  <label htmlFor="date" className="block font-medium mb-1">
    Date
  </label>
  <input
    id="date"
    name="date"
    type="text"
    value={`${new Date(formData.date).toLocaleDateString('en-GB')} Time: ${String(new Date(formData.date).getHours()).padStart(2, '0')}/${String(new Date(formData.date).getMinutes()).padStart(2, '0')}/${String(new Date(formData.date).getSeconds()).padStart(2, '0')}`}
    disabled // Non-editable
    className="w-full border rounded px-2 py-1 bg-gray-200"
  />
</div>

              {/* Other non-editable fields */}
              <div className="text-sm">
                <label htmlFor="floorNo" className="block font-medium mb-1">
                  Floor Number
                </label>
                <input
                  id="floorNo"
                  name="floorNo"
                  type="text"
                  value={formData.floorNo}
                  disabled
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="area" className="block font-medium mb-1">
                  Area
                </label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={formData.area}
                  disabled
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="location" className="block font-medium mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  disabled
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="completedAt" className="block font-medium mb-1">
                  Completed At
                </label>
                <input
                  id="completedAt"
                  name="completedAt"
                  type="text"
                  value={formData.completedAt}
                  disabled
                  className="w-full border rounded px-2 py-1 bg-gray-200"
                />
              </div>
              {/* Supervisor Approval Switch */}
              {canApprove && (

              <div className="text-sm">
                <label htmlFor="supervisorApproval" className="block font-medium mb-1">
                  Supervisor Approval
                </label>
                <input
                  id="supervisorApproval"
                  name="supervisorApproval"
                  type="checkbox"
                  checked={formData.supervisorApproval}
                  onChange={handleChange}
                  className="w-6 h-6 cursor-pointer"
                />
                <span className="ml-2">
                  {formData.supervisorApproval ? 'Approved' : 'Not Approved'}
                </span>
              </div>
              )}
              {/* File upload input */}
              <div className="text-sm">
                <label htmlFor="file" className="block font-medium mb-1">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple // Allow multiple file selection
                  onChange={handleFileChange}
                  className="w-full border rounded px-2 py-1"
                />
                {imagePreviews.length > 0 ? (
                  <div className="mt-2 flex space-x-2">
                    {imagePreviews.map((previewUrl, index) => (
                      <div key={index} className="w-32 h-32">
                        <img
                          src={previewUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                ) : formData.picture.length > 0 ? (
                  <div className="mt-2 flex space-x-2">
                    {formData.picture.map((picUrl, index) => (
                      <div key={index} className="w-32 h-32">
                        <img
                          src={picUrl}
                          alt={`Current Image ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">No image found</div>
                )}
              </div>

            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Job Slip
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
}

// Fetch the job slip data for the specific ID
export async function getServerSideProps({ params }) {
  const { id } = params;

  const jobSlip = await prisma.jobSlip.findUnique({
    where: { id: parseInt(id) },
  });

  if (!jobSlip) {
    return { notFound: true }; // Will trigger 404 if job slip not found
  }

  return {
    props: {
      jobSlip: JSON.parse(JSON.stringify(jobSlip)),
    },
  };
}
