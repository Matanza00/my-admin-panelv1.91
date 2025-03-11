"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import {
  ArrowLeft,
  Car,
  User,
  Calendar,
  Gauge,
  DollarSign,
  Save,
} from "lucide-react";

export default function EditBooking() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [endTime, setEndTime] = useState("");
  const [odometerEnd, setOdometerEnd] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/fleet/booking/${id}`);
      if (!response.ok) throw new Error("Failed to fetch booking details");
      const data = await response.json();
      setBooking(data);

      // Convert times to local timezone before setting state
      if (data.endTime) {
        const localEndTime = new Date(data.endTime).toLocaleString("en-CA", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).replace(",", "").replace(/\//g, "-");
    
        setEndTime(localEndTime.slice(0, 16).replace(" ", "T"));
    }
    
      if (data.odometerEnd) setOdometerEnd(data.odometerEnd);
      if (data.cost) setCost(data.cost);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  const formatLocalTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      endTime,
      odometerEnd: parseInt(odometerEnd, 10),
      cost: parseFloat(cost),
    };

    try {
      const response = await fetch(`/api/fleet/booking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/fleet/booking");
      } else {
        console.error("Error updating booking:", await response.json());
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading booking details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-gray-100 items-center">
        <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-3xl">
          {/* Back Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/fleet/booking")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2 transition duration-200"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <Car size={28} className="text-blue-600" /> Edit Booking
            </h1>
          </div>

          {/* Booking Info Section */}
          <div className="bg-white shadow-md rounded-lg border border-gray-300 p-6 mb-6 hover:shadow-xl transition">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <Car size={24} className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-md">Car Plate</p>
                  <p className="text-xl font-semibold">{booking.car.plate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <User size={24} className="text-purple-600" />
                <div>
                  <p className="text-gray-500 text-md">Driver</p>
                  <p className="text-xl font-semibold">{booking.driver.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Calendar size={24} className="text-green-600" />
                <div>
                  <p className="text-gray-500 text-md">Start Time</p>
                  <p className="text-xl font-semibold">
                    {formatLocalTime(booking.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Gauge size={24} className="text-yellow-600" />
                <div>
                  <p className="text-gray-500 text-md">Odometer Start</p>
                  <p className="text-xl font-semibold">
                    {booking.odometerStart} km
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg border border-gray-300 p-6 hover:shadow-xl transition"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Odometer End */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Odometer End (km)
                </label>
                <input
                  type="number"
                  value={odometerEnd}
                  onChange={(e) => setOdometerEnd(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Cost */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Cost (Fuel & Travel)
              </label>
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-green-600" />
                <input
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              <Save size={20} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
