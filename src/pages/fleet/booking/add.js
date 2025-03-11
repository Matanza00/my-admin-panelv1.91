"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../components/layout";

export default function AddBooking() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [carId, setCarId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [odometerStart, setOdometerStart] = useState("");

  useEffect(() => {
    fetchCars();
    fetchDrivers();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/fleet/cars");
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/fleet/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, driverId, startTime, odometerStart }),
      });

      if (response.ok) {
        router.push("/fleet/booking");
      } else {
        console.error("Error booking car:", await response.json());
      }
    } catch (error) {
      console.error("Error booking car:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Book a Car</h1>
          <form onSubmit={handleSubmit}>
            <select value={carId} onChange={(e) => setCarId(e.target.value)} className="w-full mb-3 p-2 border rounded">
              <option value="">Select Car</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>{car.plate}</option>
              ))}
            </select>

            <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="w-full mb-3 p-2 border rounded">
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>

            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full mb-3 p-2 border rounded" />
            <input type="number" value={odometerStart} onChange={(e) => setOdometerStart(e.target.value)} placeholder="Odometer Start" className="w-full mb-3 p-2 border rounded" />

            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Book Car</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
