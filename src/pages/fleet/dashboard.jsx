"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { Users, Truck, CheckCircle, Activity, CalendarDays, MapPin, Timer, TrendingUp,  Trophy, Clock, Filter, DollarSign, UserCheck } from "lucide-react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 30.3753,
  lng: 69.3451,
};

export default function FleetDashboard({ initialVehicles }) {
  const router = useRouter();
  const [stats, setStats] = useState({ totalDrivers: 0, totalCars: 0, totalBookings: 0 });
  const [vehicles, setVehicles] = useState(initialVehicles || []);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [carIcon, setCarIcon] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [latestBooking, setLatestBooking] = useState(null);
  const [mostBookedCars, setMostBookedCars] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [weeklySpent, setWeeklySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchVehicles();
    fetchStats();
    fetchBookings();
    fetchBookingStats();
  }, []);

  const fetchBookingStats = async (date = "") => {
    try {
      const response = await fetch(`/api/fleet/booking?fromDate=${date}`);
      const data = await response.json();
      setMostBookedCars(data.mostBookedCars);
      setTopDrivers(data.topDrivers);
      setRecentBookings(data.latestBookings);
      setWeeklySpent(data.weeklySpent);
      setMonthlySpent(data.monthlySpent);
      setTotalSpent(data.totalSpent);
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    }
  };

  const handleFilterChange = (e) => {
    const selectedDate = e.target.value;
    setFromDate(selectedDate);
    fetchBookingStats(selectedDate);
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/fleet/dashboard");
      if (!response.ok) throw new Error("Failed to fetch vehicle data");

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const [driversRes, carsRes, bookingRes] = await Promise.all([
        fetch("/api/fleet/drivers"),
        fetch("/api/fleet/cars"),
        fetch("/api/fleet/booking"),
      ]);
      const drivers = await driversRes.json();
      const cars = await carsRes.json();
      const booking = await bookingRes.json();

      setStats({
        totalDrivers: drivers.length,
        totalCars: cars.length,
        totalBookings: booking.length,
      });

      if (booking.length > 0) {
        setLatestBooking(booking[0]); // Get latest booking
      }
    } catch (error) {
      console.error("Error fetching fleet stats:", error);
    }
  };

  const fetchBookings = async (date = "") => {
    try {
      const response = await fetch(`/api/fleet/booking?fromDate=${date}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-2">
        <div className="p-6 bg-white shadow-lg rounded-xl flex-grow w-full max-w-6xl hover:shadow-2xl transition">
          
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center flex items-center gap-2">
            <Activity size={28} className="text-blue-600" /> Fleet Dashboard
          </h1>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-500 text-white rounded-lg flex flex-col items-center justify-center">
              <Users size={36} className="mb-2" />
              <h2 className="text-xl font-bold">Total Drivers</h2>
              <p className="text-3xl font-semibold">{stats.totalDrivers}</p>
            </div>

            <div className="p-6 bg-green-500 text-white rounded-lg flex flex-col items-center justify-center">
              <Truck size={36} className="mb-2" />
              <h2 className="text-xl font-bold">Total Cars</h2>
              <p className="text-3xl font-semibold">{stats.totalCars}</p>
            </div>

            <div className="p-6 bg-orange-400 text-white rounded-lg flex flex-col items-center justify-center">
              <CheckCircle size={36} className="mb-2" />
              <h2 className="text-xl font-bold">Assigned Bookings</h2>
              <p className="text-3xl font-semibold">{stats.totalBookings}</p>
            </div>
          </div>

          

          {/* Booking Analytics Row */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">

{/* Most Booked Cars */}
<div className="p-6 bg-white shadow-xl rounded-2xl border border-gray-300 backdrop-blur-lg 
transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-50 relative overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-200 via-white to-gray-300 opacity-20"></div>
  
  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
    <Trophy size={22} className="text-yellow-500" /> Top 5 Most Booked Cars
  </h2>
  
  <table className="w-full mt-4 border-collapse text-gray-700">
    <thead>
      <tr className="bg-gray-100 text-sm uppercase">
        <th className="border-b p-3 text-left">Rank</th>
        <th className="border-b p-3 text-left">Plate</th>
        <th className="border-b p-3 text-right">Bookings</th>
      </tr>
    </thead>
    <tbody>
      {mostBookedCars.length > 0 ? (
        mostBookedCars.map((car, index) => (
          <tr key={index} className="border-b hover:bg-gray-200 transition-all duration-200 cursor-pointer hover:shadow-lg">
            <td className="p-3 font-bold">{index + 1}</td>
            <td className="p-3">{car.plate}</td>
            <td className="p-3 text-right font-semibold">{car.count}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" className="p-3 text-center text-gray-500">No data available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* Top Drivers */}
<div className="p-6 bg-white shadow-xl rounded-2xl border border-gray-300 backdrop-blur-lg 
transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-50 relative overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-200 via-white to-gray-300 opacity-20"></div>
  
  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
    <UserCheck size={22} className="text-green-600" /> Top 5 Drivers
  </h2>
  
  <table className="w-full mt-4 border-collapse text-gray-700">
    <thead>
      <tr className="bg-gray-100 text-sm uppercase">
        <th className="border-b p-3 text-left">Rank</th>
        <th className="border-b p-3 text-left">Driver</th>
        <th className="border-b p-3 text-right">Trips</th>
      </tr>
    </thead>
    <tbody>
      {topDrivers.length > 0 ? (
        topDrivers.map((driver, index) => (
          <tr key={index} className="border-b hover:bg-gray-200 transition-all duration-200 cursor-pointer hover:shadow-lg">
            <td className="p-3 font-bold">{index + 1}</td>
            <td className="p-3">{driver.driver}</td>
            <td className="p-3 text-right font-semibold">{driver.count}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" className="p-3 text-center text-gray-500">No data available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* Cost Metrics */}
<div className="grid grid-cols-2 gap-4">
  <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl rounded-lg 
  transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
    <DollarSign size={24} className="mb-2 mx-auto" /> Weekly Spent
    <p className="text-2xl font-bold">${weeklySpent}</p>
  </div>
  <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl rounded-lg 
  transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
    <DollarSign size={24} className="mb-2 mx-auto" /> Monthly Spent
    <p className="text-2xl font-bold">${monthlySpent}</p>
  </div>
  <div className="p-6 bg-gradient-to-br from-gray-600 to-gray-900 text-white shadow-xl rounded-lg col-span-2 
  transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
    <DollarSign size={24} className="mb-2 mx-auto" /> Total Spent
    <p className="text-3xl font-bold">${totalSpent}</p>
  </div>
</div>

</div>

{/* Map and Transactions Row */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">

{/* Recent Transactions */}
<div className="p-6 bg-white shadow-xl rounded-2xl border border-gray-300 backdrop-blur-lg 
transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden col-span-1">
  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
    <Clock size={22} className="text-blue-600" /> Recent Transactions
  </h2>

  {/* Date Filter */}
  <div className="flex items-center gap-3 mb-4 mt-3">
    <Filter size={18} className="text-gray-500" />
    <label className="text-gray-700 font-medium">Filter by Date:</label>
    <input
      type="date"
      value={fromDate}
      onChange={handleFilterChange}
      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200 outline-none"
    />
  </div>

  <table className="w-full border-collapse text-gray-700">
    <thead>
      <tr className="bg-gray-100 text-sm uppercase">
        <th className="border-b p-3 text-left">Plate</th>
        {/* <th className="border-b p-3 text-left">Location</th> */}
        <th className="border-b p-3 text-right">Start Time</th>
      </tr>
    </thead>
    <tbody>
      {recentBookings.length > 0 ? (
        recentBookings.map((booking, index) => (
          <tr key={index} className="border-b hover:bg-gray-200 transition-all duration-200 cursor-pointer hover:shadow-lg">
            <td className="p-3">{booking.plate}</td>
            {/* <td className="p-3">{booking.location}</td> */}
            <td className="p-3 text-right">{new Date(booking.startTime).toLocaleString()}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" className="p-3 text-center text-gray-500">No recent transactions</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* Google Maps Integration */}
<div className="col-span-2 p-4 bg-white shadow-xl rounded-2xl border border-gray-300 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={6} center={center}>
      {vehicles.map((vehicle, index) => (
        <Marker key={index} position={{ lat: vehicle.lat, lng: vehicle.lng }} icon={carIcon} />
      ))}
    </GoogleMap>
  </LoadScript>
</div>

</div>


          
        </div>
      </div>
    </Layout>
  );
}
// Fetch fleet data server-side
export async function getServerSideProps() {
    try {
      const response = await fetch("http://localhost:3000/api/fleet/dashboard");
      if (!response.ok) throw new Error("Failed to fetch fleet data");
  
      const data = await response.json();
      return { props: { initialVehicles: data } };
    } catch (error) {
      console.error("Error fetching fleet data:", error);
      return { props: { initialVehicles: [] } };
    }
  }