import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { FLOORS, SERVICES_LIST } from "../../../constant"; // Import constants

export default function AddJobSlip() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    jobId: "",
    complainNo: "",
    complainBy: "",
    complainDesc: "",
    materialReq: "",
    actionTaken: "",
    attendedBy: "",
    remarks: "",
    status: "Pending",
    date: "",
    floorNo: "",
    area: "",
    location: "",
    completedAt: "",
    supervisorApproval: "No",
    managementApproval: "No",
  });

  const [availableFloors, setAvailableFloors] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

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
      const response = await fetch("/api/job-slip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/customer-relation/job-slip"); // Redirect after successful creation
      } else {
        console.error("Error adding job slip");
      }
    } catch (error) {
      console.error("Error adding job slip:", error);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Add Job Slip</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job ID */}
            <div className="text-sm">
              <label htmlFor="jobId" className="block font-medium mb-1">
                Job ID
              </label>
              <input
                id="jobId"
                name="jobId"
                type="text"
                value={formData.jobId}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Job ID"
                required
              />
            </div>

            {/* Complain Number */}
            <div className="text-sm">
              <label htmlFor="complainNo" className="block font-medium mb-1">
                Complain Number
              </label>
              <input
                id="complainNo"
                name="complainNo"
                type="text"
                value={formData.complainNo}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Complain Number"
                required
              />
            </div>

            {/* Complain By */}
            <div className="text-sm">
              <label htmlFor="complainBy" className="block font-medium mb-1">
                Complain By
              </label>
              <input
                id="complainBy"
                name="complainBy"
                type="text"
                value={formData.complainBy}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Name"
                required
              />
            </div>

            {/* Complaint Description */}
            <div className="text-sm">
              <label htmlFor="complainDesc" className="block font-medium mb-1">
                Complaint Description
              </label>
              <textarea
                id="complainDesc"
                name="complainDesc"
                value={formData.complainDesc}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Complaint Description"
                required
              />
            </div>

            {/* Area Dropdown */}
            <div className="text-sm">
              <label htmlFor="area" className="block font-medium mb-1">
                Area
              </label>
              <select
                id="area"
                name="area"
                value={formData.area}
                onChange={handleAreaChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select Area</option>
                <option value="LRA">Lower Rise Area (LRA)</option>
                <option value="HRA">High Rise Area (HRA)</option>
              </select>
            </div>

            {/* Floor Dropdown */}
            <div className="text-sm">
              <label htmlFor="floorNo" className="block font-medium mb-1">
                Floor
              </label>
              <select
                id="floorNo"
                name="floorNo"
                value={formData.floorNo}
                onChange={handleFloorChange}
                className="w-full border rounded px-2 py-1"
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

            {/* Location Dropdown */}
            <div className="text-sm">
              <label htmlFor="location" className="block font-medium mb-1">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
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

            {/* List of Services */}
            <div className="text-sm">
              <label htmlFor="listServices" className="block font-medium mb-1">
                List of Services
              </label>
              <select
                id="listServices"
                name="listServices"
                value={formData.listServices}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select a Service</option>
                {SERVICES_LIST.map((service, idx) => (
                  <option key={idx} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Fields */}
            <div className="text-sm">
              <label htmlFor="materialReq" className="block font-medium mb-1">
                Material Required
              </label>
              <input
                id="materialReq"
                name="materialReq"
                type="text"
                value={formData.materialReq}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Material Required"
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
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Attendee Name"
              />
            </div>

            <div className="text-sm">
              <label htmlFor="remarks" className="block font-medium mb-1">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter Remarks"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Job Slip
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
