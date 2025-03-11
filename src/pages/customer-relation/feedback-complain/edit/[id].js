import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import prisma from "../../../../lib/prisma";
import { FLOORS, SERVICES_LIST } from "../../../../constant"; // Import constants

export default function EditFeedbackComplain({ complainData }) {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    complain: "",
    tenant: "", // New tenant field
    date: "",
    complainBy: "",
    floorNo: "",
    area: "",
    location: "",
    locations: "",
    listServices: "",
    materialReq: "",
    actionTaken: "",
    attendedBy: "",
    remarks: "",
    status: "",
  });

  const [availableFloors, setAvailableFloors] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  // Populate form data when page loads or if `id` changes
  useEffect(() => {
    if (complainData) {
      setFormData({
        complain: complainData.complain,
        tenant: complainData.tenant?.tenantName || "", // Populate tenant name
        date: complainData.date.split("T")[0], // Format date (yyyy-mm-dd)
        complainBy: complainData.complainBy,
        floorNo: complainData.floorNo,
        area: complainData.area,
        location: complainData.location,
        locations: complainData.locations,
        listServices: complainData.listServices,
        materialReq: complainData.materialReq,
        actionTaken: complainData.actionTaken,
        attendedBy: complainData.attendedBy,
        remarks: complainData.remarks,
        status: complainData.status,
      });

      // Populate dropdown options based on initial data
      const floors = FLOORS[complainData.area] || [];
      setAvailableFloors(floors);

      const selectedFloor = floors.find((f) => f.floor === complainData.floorNo);
      setAvailableLocations(selectedFloor ? selectedFloor.locations : []);
    }
  }, [complainData]);

  const handleAreaChange = (e) => {
    const selectedArea = e.target.value;
    setFormData({ ...formData, area: selectedArea, floorNo: "", location: "" });

    const floors = FLOORS[selectedArea] || [];
    setAvailableFloors(floors);
    setAvailableLocations([]);
  };

  const handleFloorChange = (e) => {
    const selectedFloor = e.target.value;
    setFormData({ ...formData, floorNo: selectedFloor, location: "" });

    const floor = availableFloors.find((f) => f.floor === selectedFloor);
    setAvailableLocations(floor ? floor.locations : []);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/feedbackcomplain/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/customer-relation/feedback-complain"); // Redirect to success page
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };
  console.log(formData);

  if (!complainData) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Feedback/Complain #{id}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {/* Feedback/Complain */}
          {/* Tenant Name */}
          <div>
            <label className="block text-gray-700">Tenant Name</label>
            <input
              type="text"
              name="tenant"
              value={formData.tenant}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700">Feedback/Complain</label>
            <textarea
              name="complain"
              value={formData.complain}
              onChange={handleChange}
              placeholder="Enter complaint description"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-gray-700">Area</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleAreaChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Area</option>
              <option value="LRA">Lower Rise Area (LRA)</option>
              <option value="HRA">High Rise Area (HRA)</option>
            </select>
          </div>

          {/* Floor */}
          <div>
            <label className="block text-gray-700">Floor</label>
            <select
              name="floorNo"
              value={formData.floorNo}
              onChange={handleFloorChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={!availableFloors.length}
            >
              <option value="">Select Floor</option>
              {availableFloors.map((f) => (
                <option key={f.floor} value={f.floor}>
                  {f.floor}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700">Location Block</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={!availableLocations.length}
            >
              <option value="">Select Location</option>
              {availableLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          {/* Locations Required */}
          <div>
            <label className="block text-gray-700">Location Required</label>
            <input
              type="text"
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              placeholder="Enter material required"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* List of Services */}
          <div>
            <label className="block text-gray-700">List of Services</label>
            <select
              name="listServices"
              value={formData.listServices}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select a Service</option>
              {SERVICES_LIST.map((service, idx) => (
                <option key={idx} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Other Fields */}
          {/* Material Required */}
          <div>
            <label className="block text-gray-700">Material Required</label>
            <input
              type="text"
              name="materialReq"
              value={formData.materialReq}
              onChange={handleChange}
              placeholder="Enter material required"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Action Taken */}
          <div>
            <label className="block text-gray-700">Action Taken</label>
            <textarea
              name="actionTaken"
              value={formData.actionTaken}
              onChange={handleChange}
              placeholder="Enter action taken"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Attended By */}
          <div>
            <label className="block text-gray-700">Attended By</label>
            <input
              type="text"
              name="attendedBy"
              value={formData.attendedBy}
              onChange={handleChange}
              placeholder="Enter attended by"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-gray-700">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

// Fetch data for the specific complain
export async function getServerSideProps({ params }) {
  const { id } = params;

  const complainData = await prisma.feedbackComplain.findUnique({
    where: { id: parseInt(id) },
    include: {
      tenant: {
        select: {
          tenantName: true,
        },
      },
    },
  });

  if (!complainData) {
    return { notFound: true };
  }

  return {
    props: {
      complainData: JSON.parse(JSON.stringify(complainData)),
    },
  };
}
