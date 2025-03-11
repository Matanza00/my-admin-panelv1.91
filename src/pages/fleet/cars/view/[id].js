"use client";

import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Car,
  Calendar,
  Palette,
  Wrench,
  ShieldCheck,
  FileText,
  Plus,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";

export default function ViewCar() {
  const router = useRouter();
  const { id } = router.query;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
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
        setUserRole(data.user.role.toLowerCase());
      } else {
        console.error("User role not found in session data.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/fleet/cars/${id}`);
      const data = await response.json();
      setCar(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching car details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading car details...</p>
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-lg">Car not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <div className="p-8 bg-white shadow-lg rounded-lg max-w-6xl mx-auto flex-grow">
          
          {/* Back Button */}
          <button
            onClick={() => router.push("/fleet/cars")}
            className="mb-6 px-5 py-3 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-3 transition duration-200"
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center gap-3">
            <Car size={28} className="text-blue-600" /> Car Details
          </h1>

          {/* Car Information Section */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-300 p-8 hover:shadow-xl transition duration-300">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <BadgeCheck size={24} className="text-green-600" />
                <div>
                  <p className="text-gray-500 text-md">Plate Number</p>
                  <p className="text-xl font-semibold">{car.plate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Car size={24} className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-md">VIN No</p>
                  <p className="text-xl font-semibold">{car.vinNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Palette size={24} className="text-yellow-600" />
                <div>
                  <p className="text-gray-500 text-md">Color</p>
                  <p className="text-xl font-semibold">{car.color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance & Insurance Records */}
          <div className="grid grid-cols-2 gap-8 mt-10">
            
            {/* Maintenance Records */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-300 p-8 hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <Wrench size={28} className="text-blue-600" /> Maintenance Records
                </h2>
                <Link href={`/fleet/cars/${id}/maintenance/add`}>
                  <button className="bg-blue-500 text-white px-4 py-2 ml-4 rounded-md flex items-center gap-3 hover:bg-blue-600 transition">
                    <Plus size={20} /> Add
                  </button>
                </Link>
              </div>
              {car.maintenanceRecords.length > 0 ? (
                <ul className="space-y-4">
                  {car.maintenanceRecords.map((record) => (
                    <li key={record.id} className="p-4 bg-gray-50 rounded-md shadow-sm flex items-center justify-between hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <FileText size={22} className="text-gray-600" />
                        <p className="text-gray-800 text-lg">
                          {new Date(record.startDate).toLocaleDateString()} - {record.endDate ? new Date(record.endDate).toLocaleDateString() : "Ongoing"}
                        </p>
                      </div>
                      <div className="flex gap-3 ml-4">
                        <Link href={`/fleet/cars/${id}/maintenance/view/${record.id}`}>
                          <button className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <Link href={`/fleet/cars/${id}/maintenance/edit/${record.id}`}>
                          <button className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                            <Pencil size={18} />
                          </button>
                        </Link>
                        {/* Show Delete Button Only for Superadmin & Admin */}
                        {(userRole === "superadmin" || userRole === "admin" || userRole === "supervisor") && (
                        <button className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                          <Trash2 size={18} />
                        </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No maintenance records available.</p>
              )}
            </div>

            {/* Insurance Records */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-300 p-8 hover:shadow-xl transition duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <ShieldCheck size={28} className="text-green-600" /> Insurance Records
                </h2>
                <Link href={`/fleet/cars/${id}/insurance/add`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-3 hover:bg-green-600 transition">
                    <Plus size={20} /> Add
                </button>
                </Link>
            </div>

                {/* Ensure insurance records exist before mapping */}
                {car.insurances && car.insurances.length > 0 ? (
                    <ul className="space-y-4">
                    {car.insurances.map((insurance) => (
                        <li key={insurance.id} className="p-4 bg-gray-50 rounded-md shadow-sm flex items-center justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <FileText size={22} className="text-gray-600" />
                            <p className="text-gray-800 text-lg">
                            {new Date(insurance.startDate).toLocaleDateString()} - {insurance.endDate ? new Date(insurance.endDate).toLocaleDateString() : "Ongoing"}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/fleet/cars/${id}/insurance/view/${insurance.id}`}>
                            <button className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600">
                                <Eye size={18} />
                            </button>
                            </Link>
                            <Link href={`/fleet/cars/${id}/insurance/edit/${insurance.id}`}>
                            <button className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                                <Pencil size={18} />
                            </button>
                            </Link>
                            {/* Show Delete Button Only for Superadmin & Admin */}
                            {(userRole === "superadmin" || userRole === "admin" || userRole === "supervisor") && (
                            <button className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                            <Trash2 size={18} />
                            </button>
                            )}
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No insurance records available.</p>
                )}
                </div>


          </div>

        </div>
      </div>
    </Layout>
  );
}
