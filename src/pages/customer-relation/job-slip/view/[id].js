import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../../components/layout';

export default function JobSlipView() {
  const [jobSlip, setJobSlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query; // Get the job slip ID from the URL

  useEffect(() => {
    if (id) {
      // Fetch job slip details from the API
      const fetchJobSlip = async () => {
        try {
          const response = await fetch(`/api/job-slip/${id}`);
          if (!response.ok) {
            throw new Error('Job slip not found');
          }
          const data = await response.json();
          setJobSlip(data);
        } catch (error) {
          console.error('Error fetching job slip:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobSlip();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-6">Loading Job Slip...</h1>
        </div>
      </Layout>
    );
  }

  if (!jobSlip) {
    return (
      <Layout>
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-6">Job Slip Not Found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Job Slip Details</h1>

        {/* Job Slip Info */}
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Static fields */}
            <div className="text-sm">
              <label className="block font-bold mb-1">Job ID</label>
              <p>{jobSlip.jobId}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Complain Number</label>
              <p>{jobSlip.complainNo}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">MIF No.</label>
              <p>{jobSlip.inventoryRecieptNo}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Attended By</label>
              <p>{jobSlip.attendedBy}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Complain Description</label>
              <p>{jobSlip.complaintDesc}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Material Required</label>
              <p>{jobSlip.materialReq}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Action Taken</label>
              <p>{jobSlip.actionTaken}</p>
            </div>
            
            <div className="text-sm">
              <label className="block font-bold mb-1">Remarks</label>
              <p>{jobSlip.remarks}</p>
            </div>
            
            <div className="text-sm">
  <label className="block font-bold mb-1">Date</label>
  <p>
    {new Date(jobSlip.date).toLocaleDateString('en-GB')} Time:{" "}
    {`${String(new Date(jobSlip.date).getHours()).padStart(2, '0')}/${String(
      new Date(jobSlip.date).getMinutes()
    ).padStart(2, '0')}/${String(new Date(jobSlip.date).getSeconds()).padStart(2, '0')}`}
  </p>
</div>

            <div className="text-sm">
              <label className="block font-bold mb-1">Floor Number</label>
              <p>{jobSlip.floorNo}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Area</label>
              <p>{jobSlip.area}</p>
            </div>
            <div className="text-sm">
              <label className="block font-bold mb-1">Department</label>
              <p>{jobSlip.department}</p>
            </div>
            {/* <div className="text-sm">
              <label className="block font-bold mb-1">Location</label>
              <p>{jobSlip.location}</p>
            </div> */}
            {jobSlip.completed_At && (
              <div className="text-sm">
                <label className="block font-bold mb-1">Completed At</label>
                <p>{new Date(jobSlip.completed_At).toLocaleDateString()}</p>
              </div>
            )}
            <div className="text-sm grid">
            <div className="text-sm">
              <label className="block font-bold mb-1">Supervisor Approval</label>
              <p
                className={`px-2 py-1 rounded inline-block ${
                  jobSlip.supervisorApproval
                    ? 'bg-green-200 text-green-800'
                    : 'bg-orange-200 text-orange-800'
                }`}
              >
                {jobSlip.supervisorApproval ? 'Approved' : 'Pending'}
              </p>
            </div>

            <div className="text-sm">
              <label className="block font-bold mb-1">Management Approval</label>
              <p
                className={`px-2 py-1 rounded inline-block ${
                  jobSlip.managementApproval
                    ? 'bg-green-200 text-green-800'
                    : 'bg-orange-200 text-orange-800'
                }`}
              >
                {jobSlip.managementApproval ? 'Approved' : 'Pending'}
              </p>
            </div>
            </div>
            {/* New fields */}
            <div className="text-sm">
              <label className="block font-bold mb-1">Status</label>
              <p
                className={`px-2 py-1 rounded inline-block ${
                  jobSlip.status === 'Pending'
                    ? 'bg-yellow-200 text-yellow-800'
                    : jobSlip.status === 'InProgress'
                    ? 'bg-orange-200 text-orange-800'
                    : jobSlip.status === 'Completed'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-800' // Default color
                }`}
              >
                {jobSlip.status}
              </p>
            </div>
            
            


            {/* Feedback Complain details */}
            <div className="col-span-3">
              <h3 className="font-bold mb-2 text-lg">Feedback/Complain Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-sm">
                  <label className="block font-bold mb-1">Complain</label>
                  <p>{jobSlip.feedbackComplain.complain}</p>
                </div>
                <div className="text-sm">
                  <label className="block font-bold mb-1">Services</label>
                  <p>{jobSlip.feedbackComplain.listServices}</p>
                </div>
                <div className="text-sm">
                  <label className="block font-bold mb-1">Action Taken</label>
                  <p>{jobSlip.feedbackComplain.actionTaken}</p>
                </div>
                <div className="text-sm">
                  <label className="block font-bold mb-1">Attended By</label>
                  <p>{jobSlip.feedbackComplain.attendedBy}</p>
                </div>
                <div className="text-sm">
                  <label className="block font-bold mb-1">Status</label>
                  <p>{jobSlip.feedbackComplain.status}</p>
                </div>
                <div className="text-sm">
                  <label className="block font-bold mb-1">Remarks</label>
                  <p>{jobSlip.feedbackComplain.remarks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
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
