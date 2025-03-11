"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../components/layout";
import { ArrowLeft, Calendar, UploadCloud, Trash2, ShieldCheck } from "lucide-react";
import { Image } from "lucide-react";


export default function EditInsuranceRecord() {
  const router = useRouter();
  const { id, insuranceId } = router.query;

  const [form, setForm] = useState({ startDate: "", endDate: "", images: "" });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && insuranceId) fetchRecord();
  }, [id, insuranceId]);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/fleet/insurance/${insuranceId}`);
      if (!response.ok) {
        console.error("🚨 API Error:", response.statusText);
        return;
      }
  
      const data = await response.json();
  
      const formatDateToLocal = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0]; // ✅ Convert to YYYY-MM-DD format
      };
  
      setForm({
        startDate: formatDateToLocal(data.startDate),
        endDate: formatDateToLocal(data.endDate), // ✅ Fix for missing endDate
        images: data.images || "",
        carId: data.carId || id, // ✅ Ensure carId is always included
      });
  
      setImagePreviews(data.images ? data.images.split(",") : []);
    } catch (error) {
      console.error("🚨 Error fetching record:", error);
    }
  };
  
     // Inside handleDeleteImage function
    const handleDeleteImage = (index) => {
        setImagePreviews((prev) => {
        const updatedImages = [...prev];
        updatedImages.splice(index, 1);
        setForm((prevForm) => ({
            ...prevForm,
            images: updatedImages.join(","), // Update form.images with remaining images
        }));
        return updatedImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // ✅ Validate required fields before submitting
        if (!form.carId || !form.startDate) {
          console.error("🚨 Missing required fields:", { carId: form.carId, startDate: form.startDate });
          alert("Car ID and Start Date are required!");
          return;
        }
      
        setSubmitting(true);
        try {
          const response = await fetch(`/api/fleet/insurance/${insuranceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              carId: form.carId,  // ✅ Ensure carId is included
              startDate: form.startDate,
              endDate: form.endDate,
              images: imagePreviews.join(","), // ✅ Send only remaining images
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error("🚨 API Error:", errorData);
            return;
          }
      
          router.push(`/fleet/cars/view/${id}`);
        } catch (error) {
          console.error("🚨 Error updating record:", error);
        } finally {
          setSubmitting(false);
        }
      };
      

  return (
    <Layout>
      <div className="flex min-h-screen w-full justify-center items-center bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-md hover:shadow-xl transition">
          <button onClick={() => router.back()} 
            className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Insurance Record</h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar size={18} /> Start Date
              </span>
              <input type="date" name="startDate" value={form.startDate || ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="border p-2 rounded-md w-full" />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar size={18} /> End Date
              </span>
              <input type="date" name="endDate" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className="border p-2 rounded-md w-full" />
            </label>
            
            {/* Inside form */}
            {imagePreviews.length > 0 && (
            <div className="mt-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                <Image size={18} className="text-blue-600" /> Uploaded Documents
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((previewUrl, index) => (
                    <div key={index} className="relative group">
                    <img 
                        src={previewUrl} 
                        alt={`Preview ${index + 1}`} 
                        className="w-24 h-24 border rounded-md object-cover shadow-md hover:shadow-lg transition"
                    />
                    {/* Delete Button (Appears on Hover) */}
                    <button 
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-75 hover:opacity-100 transition"
                    >
                        <Trash2 size={14} />
                    </button>
                    </div>
                ))}
                </div>
            </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
