import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../components/layout";
import { ArrowLeft, Calendar, UploadCloud } from "lucide-react"; // Icons

export default function AddMaintenanceRecord() {
  const router = useRouter();
  const carId = router.query.id;
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    images: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!carId) {
      console.error("🚨 Error: Car ID is missing in URL!", router.query);
    }
  }, [carId]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploadedImageUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          const newImageUrl = `/uploads/${data.filename}`;
          uploadedImageUrls.push(newImageUrl);
        }
      } catch (error) {
        console.error("❌ Error uploading image:", error);
      }
    }

    setUploading(false);
    setForm((prev) => ({
      ...prev,
      images: prev.images ? `${prev.images},${uploadedImageUrls.join(",")}` : uploadedImageUrls.join(","),
    }));
    setImagePreviews((prev) => [...prev, ...uploadedImageUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!carId) {
      console.error("🚨 Error: Car ID is missing! Cannot submit.");
      return;
    }

    if (uploading) {
      console.error("🚨 Please wait for images to finish uploading.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/fleet/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          carId: parseInt(carId),
          startDate: form.startDate,
          endDate: form.endDate,
          images: form.images,
        }),
      });

      if (response.ok) {
        console.log("✅ Maintenance record added successfully!");
        router.push(`/fleet/cars/view/${carId}`);
      } else {
        console.error("❌ Error adding maintenance record:", await response.json());
      }
    } catch (error) {
      console.error("❌ Error sending request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen w-full justify-center items-center bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-md">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-700">Add Maintenance Record</h1>
          </div>

          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>

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

            {/* Image Preview */}
            {uploading && <p className="text-blue-500">Uploading images...</p>}
            {imagePreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((previewUrl, index) => (
                  <img 
                    key={index} 
                    src={previewUrl} 
                    alt={`Preview ${index + 1}`} 
                    className="w-24 h-24 border rounded-md object-cover"
                  />
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Add Maintenance Record"}
            </button>

            {/* Warning if Car ID is missing */}
            {!carId && <p className="text-red-500 text-sm mt-2">⚠️ Car ID is missing. Please check the URL.</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
}
