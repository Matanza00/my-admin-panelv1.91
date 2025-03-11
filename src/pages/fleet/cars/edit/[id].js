"use client";

import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import { useRouter } from "next/router";
import { ArrowLeft, Car, Hash, Palette, Calendar, ClipboardEdit, Save } from "lucide-react";

export default function EditCar() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    plate: "",
    vinNo: "",
    color: "",
    make: "",
    model: "",
    year: "",
  });

  useEffect(() => {
    if (id) fetchCar();
  }, [id]);

  // Fetch car details
  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/fleet/cars/${id}`);
      const data = await response.json();

      setForm({
        plate: data.plate || "",
        vinNo: data.vinNo || "",
        color: data.color || "",
        make: data.make || "",
        model: data.model || "",
        year: data.year || "",
      });
    } catch (error) {
      console.error("Error fetching car:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/fleet/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/fleet/cars");
      }
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-lg hover:shadow-xl transition">
          
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="mb-6 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2 transition duration-200"
          >
            <ArrowLeft size={16} /> Go Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <ClipboardEdit size={24} className="text-blue-600" /> Edit Car Details
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Plate Number */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Hash size={18} /> Plate Number
              </span>
              <input
                type="text"
                name="plate"
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value })}
                placeholder="Enter plate number"
                className="border border-gray-300 p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none"
              />
            </label>

            {/* VIN Number */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Car size={18} /> VIN Number
              </span>
              <input
                type="text"
                name="vinNo"
                value={form.vinNo}
                onChange={(e) => setForm({ ...form, vinNo: e.target.value })}
                placeholder="Enter VIN number"
                className="border border-gray-300 p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none"
              />
            </label>

            {/* Color */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Palette size={18} /> Color
              </span>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Enter car color"
                className="border border-gray-300 p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none"
              />
            </label>

            {/* Make & Model */}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 font-medium flex items-center gap-2">
                  <Car size={18} /> Make
                </span>
                <input
                  type="text"
                  name="make"
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                  placeholder="Enter make"
                  className="border border-gray-300 p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium flex items-center gap-2">
                  <Car size={18} /> Model
                </span>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="Enter model"
                  className="border border-gray-300 p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none"
                />
              </label>
            </div>

            {/* Year */}
            <label className="block">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Calendar size={18} /> Year
              </span>
              <input
                type="text"
                name="year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="Enter year"
                className="border border-gray-300 p-2 rounded-md w-full mt-1 focus:ring focus:ring-blue-200 outline-none"
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Save size={18} /> Update Car
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
