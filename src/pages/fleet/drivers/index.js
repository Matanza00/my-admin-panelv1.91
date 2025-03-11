"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import Link from "next/link";
import { ArrowLeft, Eye, Pencil, Trash2, Plus, User, Phone, Briefcase } from "lucide-react";

export default function Drivers() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
    fetchDrivers();
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

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/fleet/drivers");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      const response = await fetch(`/api/fleet/drivers/${driverId}`, { method: "DELETE" });

      if (response.ok) {
        setDrivers(drivers.filter((driver) => driver.id !== driverId));
      } else {
        console.error("Error deleting driver:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
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
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <User size={24} className="text-blue-600" /> Fleet Drivers
            </h1>
            <Link href="/fleet/drivers/add">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg">
                <Plus size={16} /> Add Driver
              </button>
            </Link>
          </div>

          {/* Table Container with 3D Effect */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300 p-4 hover:shadow-2xl transition">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm shadow-md">
                <tr>
                  <th className="border-b px-4 py-3 text-left">Name</th>
                  <th className="border-b px-4 py-3 text-left">Department</th>
                  <th className="border-b px-4 py-3 text-left">Phone No</th>
                  <th className="border-b px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length > 0 ? (
                  drivers.map((driver, index) => (
                    <tr
                      key={driver.id}
                      className={`transition duration-200 group`}
                      style={{
                        background: index % 2 === 0 ? "#f9f9f9" : "white",
                        transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
                        borderRadius: "8px",
                      }}
                    >
                      {/* Name */}
                      <td className="border-b px-4 py-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                        <div className="flex items-center gap-2">
                          <User size={18} className="text-gray-500" /> {driver.name}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="border-b px-4 py-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-gray-500" /> {driver.department}
                        </div>
                      </td>

                      {/* Phone No */}
                      <td className="border-b px-4 py-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                        <div className="flex items-center gap-2">
                          <Phone size={18} className="text-gray-500" /> {driver.phoneNo}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="border-b px-4 py-3 flex gap-3 group-hover:bg-gray-200 group-hover:shadow-lg group-hover:scale-105 transition duration-200">
                        <div className="flex gap-3">
                          <Link href={`/fleet/drivers/view/${driver.id}`}>
                            <button className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600 transition shadow-md hover:shadow-lg">
                              <Eye size={16} /> View
                            </button>
                          </Link>
                          <Link href={`/fleet/drivers/edit/${driver.id}`}>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-yellow-600 transition shadow-md hover:shadow-lg">
                              <Pencil size={16} /> Edit
                            </button>
                          </Link>

                          {/* Show Delete Button Only for Admin & Superadmin */}
                          {(userRole === "super_admin") && (
                            <button 
                              onClick={() => handleDeleteDriver(driver.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition shadow-md hover:shadow-lg"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No drivers found.
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
