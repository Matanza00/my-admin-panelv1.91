"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../components/layout";
import Link from "next/link";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

export default function Bookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/fleet/booking", { cache: "no-store" }); // ✅ Prevent caching
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  console.log(bookings);

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/fleet/booking/${id}`, { method: "DELETE" });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== id));
      } else {
        console.error("Error deleting booking:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-5xl">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Car Bookings</h1>

          <Link href="/fleet/booking/add">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              <Plus size={16} /> Book a Car
            </button>
          </Link>

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300 p-4 mt-4">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="border-b px-4 py-3 text-left">Car</th>
                  <th className="border-b px-4 py-3 text-left">Driver</th>
                  <th className="border-b px-4 py-3 text-left">Odometer Start</th>
                  {/* <th className="border-b px-4 py-3 text-left">Start Time</th> */}
                  <th className="border-b px-4 py-3 text-left">Status</th>
                  <th className="border-b px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className={`hover:bg-gray-100 transition ${
                        booking.status === "BOOKED" ? "bg-orange-200" : "bg-green-200"
                      }`}
                    >
                      <td className="border-b px-4 py-3">{booking.car.plate}</td>
                      <td className="border-b px-4 py-3">{booking.driver.name}</td>
                      <td className="border-b px-4 py-3">{booking.odometerStart} km</td>
                      {/* <td className="border-b px-4 py-3">{new Date(booking.startTime).toLocaleString()}</td> */}
                      <td className="border-b px-4 py-3 font-semibold">{booking.status}</td>
                      <td className="border-b px-4 py-3 flex gap-3">
                        <Link href={`/fleet/booking/view/${booking.id}`}>
                          <button className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600">
                            <Eye size={16} /> View
                          </button>
                        </Link>
                        {booking.status === "BOOKED" && (
                          <Link href={`/fleet/booking/edit/${booking.id}`}>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-yellow-600">
                              <Pencil size={16} /> Edit
                            </button>
                          </Link>
                        )}
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600">
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">No bookings found.</td>
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
