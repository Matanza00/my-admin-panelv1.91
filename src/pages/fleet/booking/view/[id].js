"use client";

import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Car,
  User,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Fuel,
  CheckCircle,
  AlertCircle,
  Pencil
} from "lucide-react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";

export default function ViewBooking() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/fleet/booking/view`);
      if (!response.ok) throw new Error("Failed to fetch booking details");

      const data = await response.json();
      const matchedBooking = data.find((b) => b.id === parseInt(id));
      if (matchedBooking) {
        setBooking(matchedBooking);
        if (matchedBooking.vehicleData) {
          setVehicleData(matchedBooking.vehicleData);
        }
      } else {
        console.warn("No matching booking found.");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
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
      <div className="flex flex-col">
        <div className="p-8 bg-white shadow-lg rounded-lg max-w-6xl mx-auto flex-grow">
          
          {/* Back Button */}
          <button
            onClick={() => router.push("/fleet/booking")}
            className="mb-6 px-5 py-3 text-sm bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-3 transition duration-200"
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          {/* Title */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
                <Car size={28} className="text-blue-600" /> Booking Details
            </h1>
            <button
                onClick={() => router.push(`/fleet/booking/edit/${booking.id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-yellow-600 transition duration-200"
            >
                <Pencil size={18} /> Edit
            </button>
            </div>


          {/* Booking Information Section */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-300 p-8 hover:shadow-xl transition duration-300">
            <div className="grid grid-cols-2 gap-8">
              
              {/* Car Plate */}
              <div className="flex items-center gap-4">
                <BadgeCheck size={24} className="text-green-600" />
                <div>
                  <p className="text-gray-500 text-md">Car Plate</p>
                  <p className="text-xl font-semibold">{booking.car.plate}</p>
                </div>
              </div>

              {/* Assigned Driver */}
              <div className="flex items-center gap-4">
                <User size={24} className="text-purple-600" />
                <div>
                  <p className="text-gray-500 text-md">Driver</p>
                  <p className="text-xl font-semibold">{booking.driver.name}</p>
                </div>
              </div>

              {/* Start Time */}
              <div className="flex items-center gap-4">
                <Clock size={24} className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-md">Start Time</p>
                  <p className="text-xl font-semibold">{new Date(booking.startTime).toLocaleString()}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                {booking.status === "BOOKED" ? (
                  <AlertCircle size={24} className="text-yellow-600" />
                ) : (
                  <CheckCircle size={24} className="text-green-600" />
                )}
                <div>
                  <p className="text-gray-500 text-md">Status</p>
                  <p className={`text-xl font-semibold ${booking.status === "BOOKED" ? "text-yellow-600" : "text-green-600"}`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Odometer & Cost Information */}
          <div className="grid grid-cols-2 gap-8 mt-10">
            
            {/* Odometer Readings */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-300 p-8 hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
                <TrendingUp size={28} className="text-blue-600" /> Odometer Readings
              </h2>
              <p className="text-gray-600"><strong>Start:</strong> {booking.odometerStart} km</p>
              {booking.endTime && (
                <>
                  <p className="text-gray-600"><strong>End:</strong> {booking.odometerEnd} km</p>
                  <p className="text-gray-800 font-semibold mt-2">
                    Distance Traveled: {booking.distanceTraveled} km
                  </p>
                </>
              )}
            </div>

            {/* Cost Information */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-300 p-8 hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
                <DollarSign size={28} className="text-green-600" /> Cost Summary
              </h2>
              {booking.cost ? (
                <p className="text-gray-800 font-semibold">${booking.cost}</p>
              ) : (
                <p className="text-gray-500">Cost not added yet.</p>
              )}
            </div>
          </div>

          {/* Google Maps Section */}
          {vehicleData ? (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Car Location</h2>
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onLoad={() => setMapLoaded(true)}
              >
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "300px", borderRadius: "10px" }}
                  center={{ lat: vehicleData.lat, lng: vehicleData.lng }}
                  zoom={15}
                >
                  {mapLoaded && (
                    <Marker
                      position={{ lat: vehicleData.lat, lng: vehicleData.lng }}
                      onClick={() => setSelectedVehicle(vehicleData)}
                      icon={{
                        url: "/car-icon.png",
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No location data available for this car.</p>
          )}

        </div>
      </div>
    </Layout>
  );
}
