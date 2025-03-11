"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import Link from "next/link";
import { ArrowLeft, Eye, Pencil, Trash2, Plus, Car, Hash, User, MapPin } from "lucide-react";

export default function Cars() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [carApi, setCarApi] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
    fetchCarsWithLocation(); // Fetch car details with location data
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("http://182.180.99.136:3000/api/auth/session");
      if (!response.ok) {
        console.error("Error fetching session data:", response.statusText);
        return;
      }

      const data = await response.json();
      if (data && data.user && data.user.role) {
        setUserRole(data.user.role.toLowerCase()); // ✅ Convert to lowercase
      } else {
        console.error("User role not found in session data.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchCarsWithLocation = async () => {
    try {
      const response = await fetch("/api/fleet/cars-with-location"); // Fetch from new API
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars with location:", error);
    }
  };
  

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      const response = await fetch(`/api/fleet/cars/${carId}`, { method: "DELETE" });

      if (response.ok) {
        setCars(cars.filter((car) => car.id !== carId));
      } else {
        console.error("Error deleting car:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="p-6 bg-white shadow-lg rounded-xl flex-grow w-full max-w-5xl hover:shadow-2xl transition">
          
          {/* Back Button */}
          <button 
            onClick={() => router.push("/fleet/dashboard")} 
            className="mb-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2 transition duration-200"
          >
            <ArrowLeft size={16} /> Go Back
          </button>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Fleet Cars</h1>
            <Link href="/fleet/cars/add">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg">
                <Plus size={16} /> Add Car
              </button>
            </Link>
          </div>

          {/* Table Container with 3D Effect */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300 p-4 hover:shadow-2xl transition">
            <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm shadow-md">
                <tr>
                  <th className="border-b px-4 py-3 text-left">Plate</th>
                  <th className="border-b px-4 py-3 text-left">Model</th>
                  <th className="border-b px-4 py-3 text-left">Location</th>    
                  <th className="border-b px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.length > 0 ? (
                  cars.map((car, index) => (
                    <tr 
                      key={car.id} 
                      className={`transition duration-200 group`}
                      style={{
                        background: index % 2 === 0 ? "#f9f9f9" : "white",
                        transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
                        borderRadius: "8px",
                      }}
                    >
                       <td className="border-b px-4 py-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                        <div className="flex items-center gap-2">
                        <Hash size={18} className="text-gray-500" />{car.plate}
                        </div>
                      </td>
                      <td className="border-b px-4 py-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                         <div className="flex items-center gap-2">
                         <Car size={18} className="text-gray-500" />{car.model} ({car.year})
                        </div>
                      </td>
                      <td className="border-b px-4 py-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                         <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        <span className="font-bold">{car.location}</span> {/* BOLD location */}
                        </div>
                    </td>                
                      <td className="border-b px-4 py-3 flex gap-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                        <Link href={`/fleet/cars/view/${car.id}`}>
                          <button className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600 transition shadow-md hover:shadow-lg">
                            <Eye size={16} /> View
                          </button>
                        </Link>
                        <Link href={`/fleet/cars/edit/${car.id}`}>
                          <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-yellow-600 transition shadow-md hover:shadow-lg">
                            <Pencil size={16} /> Edit
                          </button>
                        </Link>

                        {/* Show Delete Button Only for Admin & Superadmin */}
                        {(userRole === "super_admin") && (
                          <button 
                            onClick={() => handleDeleteCar(car.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition shadow-md hover:shadow-lg"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No cars found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
