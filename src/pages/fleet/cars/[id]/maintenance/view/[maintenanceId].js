"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../components/layout";
import { ArrowLeft, Calendar, Image, Pencil, Trash2 } from "lucide-react";

export default function ViewMaintenanceRecord() {
  const router = useRouter();
  const { id, maintenanceId } = router.query;  // ✅ Now correctly gets maintenanceId

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && maintenanceId) fetchRecord();
  }, [id, maintenanceId]);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/fleet/maintenance/${maintenanceId}`);
      const data = await response.json();
      setRecord(data);
    } catch (error) {
      console.error("Error fetching maintenance record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this maintenance record?")) return;
    try {
      const response = await fetch(`/api/fleet/maintenance/${maintenanceId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push(`/fleet/cars/view/${id}`);
      } else {
        console.error("Failed to delete maintenance record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  if (loading) return <Layout><p className="text-center text-gray-500">Loading...</p></Layout>;
  if (!record) return <Layout><p className="text-center text-red-500">Maintenance record not found.</p></Layout>;

  return (
    <Layout>
      <div className="flex min-h-screen w-full justify-center items-center bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-lg hover:shadow-xl transition">
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Maintenance Details</h1>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-blue-600" />
              <div>
                <p className="text-gray-500 text-sm">Start Date</p>
                <p className="text-lg font-semibold">{new Date(record.startDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-blue-600" />
              <div>
                <p className="text-gray-500 text-sm">End Date</p>
                <p className="text-lg font-semibold">{record.endDate ? new Date(record.endDate).toLocaleDateString() : "Ongoing"}</p>
              </div>
            </div>

            {/* Images Section */}
            <div>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Image size={18} className="text-blue-600" /> Uploaded Images
              </p>
              {record.images ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {record.images.split(",").map((img, index) => (
                    <img key={index} src={img} alt="Maintenance" className="w-24 h-24 border rounded-md object-cover" />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No images uploaded</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button onClick={() => router.push(`/fleet/cars/${id}/maintenance/edit/${maintenanceId}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-yellow-600 transition">
              <Pencil size={18} /> Edit
            </button>

            <button onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition">
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
