"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../components/layout";
import { ArrowLeft, Calendar, UploadCloud, Trash2, Image } from "lucide-react";

export default function EditMaintenanceRecord() {
  const router = useRouter();
  const { id, maintenanceId } = router.query;

  const [form, setForm] = useState({ startDate: "", endDate: "", images: "" });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && maintenanceId) fetchRecord();
  }, [id, maintenanceId]);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/fleet/maintenance/${maintenanceId}`);
      if (!response.ok) {
        console.error("🚨 API Error:", response.statusText);
        return;
      }
  
      const data = await response.json();
  
      // ✅ Convert UTC date to local date format
      const formatDateToLocal = (dateString) => {
        if (!dateString) return ""; // Handle empty values safely
        const localDate = new Date(dateString);
        return localDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
      };
  
      setForm({
        startDate: formatDateToLocal(data.startDate),  // ✅ Local Time Conversion
        endDate: formatDateToLocal(data.endDate),      // ✅ Local Time Conversion
        images: data.images || "",
      });
  
      setImagePreviews(data.images ? data.images.split(",") : []);
    } catch (error) {
      console.error("🚨 Error fetching record:", error);
    }
  };
  

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploadedImageUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await response.json();
        if (response.ok) uploadedImageUrls.push(`/uploads/${data.filename}`);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setUploading(false);
    setForm((prev) => ({
      ...prev,
      images: prev.images ? `${prev.images},${uploadedImageUrls.join(",")}` : uploadedImageUrls.join(","),
    }));
    setImagePreviews((prev) => [...prev, ...uploadedImageUrls]);
  };

  const handleDeleteImage = (index) => {
    setImagePreviews((prev) => {
      const updatedImages = [...prev];
      updatedImages.splice(index, 1); // Remove image at given index
  
      // ✅ Update form.images to match updated previews
      setForm((prevForm) => ({
        ...prevForm,
        images: updatedImages.join(","), // Convert back to a comma-separated string
      }));
  
      return updatedImages;
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submitting Form Data:", form);  // ✅ Debugging log
    setSubmitting(true);
  
    try {
      const response = await fetch(`/api/fleet/maintenance/${maintenanceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: id,  // ✅ Ensure carId is included
          startDate: form.startDate,
          endDate: form.endDate,
          images: imagePreviews.join(","), // ✅ Only send remaining images
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("🚨 API Error:", data);
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
        <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-lg hover:shadow-xl transition">
          
          {/* Back Button */}
          <button onClick={() => router.back()} 
            className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Maintenance Record</h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Start Date */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar size={18} /> Start Date
              </span>
              <input 
                type="date" 
                name="startDate" 
                value={form.startDate} 
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                required 
                className="border p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none" 
              />
            </label>

            {/* End Date */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar size={18} /> End Date
              </span>
              <input 
                type="date" 
                name="endDate" 
                value={form.endDate} 
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
                className="border p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none" 
              />
            </label>

            {/* File Upload */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <UploadCloud size={18} /> Upload Images
              </span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
                className="w-full border rounded-md px-2 py-1 mt-1 focus:ring focus:ring-blue-200 outline-none" 
              />
            </label>

            {/* Image Preview Section */}
            {imagePreviews.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
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
            ) : (
              <p className="text-gray-500 italic">No images uploaded</p>
            )}


            {/* Submit Button */}
            <button 
              type="submit" 
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`} 
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
