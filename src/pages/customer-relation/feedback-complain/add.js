import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { FLOORS, SERVICES_LIST } from "../../../constant"; // Import constants
import { useSession } from "next-auth/react";

export default function AddPage() {
  const [complain, setComplain] = useState("");
  const [complainBy] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState("");
  const [listServices, setListServices] = useState(""); // Updated to handle services
  const [materialReq, setMaterialReq] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [ setAttendedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status] = useState("Pending");

  const [availableFloors, setAvailableFloors] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  const router = useRouter();

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [ userId, setUserId] = useState(null); // Store the user's ID
  // Fetch the current user's ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data?.user?.id) {
          setUserId(data.user.id); // Set the user ID
        } else {
          console.error('Failed to fetch user session');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      console.log('Fetching profile for user ID:', session.user.id);

      // Fetch user profile data using the user ID
      fetch(`/api/profile?id=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log('Profile data received:', data);
          if (data.user) {
            setUserData(data.user);
          } else {
            console.error('Error in data:', data.error);
          }
        })
        .catch((err) => console.error('Error fetching profile:', err));
    }
  }, [session]);
  

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("/api/tenants");
        if (response.ok) {
          const result = await response.json();
          console.log("Fetched tenants:", result); // Debugging
          setTenants(result.data || []); // ✅ Ensure `tenants` is always an array
        } else {
          console.error("Error fetching tenants");
          setTenants([]); // ✅ Set as an empty array on error
        }
      } catch (error) {
        console.error("Error fetching tenants:", error);
        setTenants([]); // ✅ Set as an empty array in case of failure
      }
    };
  
    fetchTenants();
  }, []);
  


  const handleAreaChange = (e) => {
    const selectedArea = e.target.value;
    setArea(selectedArea);
  
    // Update available floors for the selected area
    const floors = FLOORS[selectedArea] || [];
    setAvailableFloors(floors);
    setFloorNo(""); // Reset floor when area changes
    setAvailableLocations([]); // Reset locations when area changes
  };
  
  const handleFloorChange = (e) => {
    const selectedFloor = e.target.value;
    setFloorNo(selectedFloor);
  
    // Find the selected floor and populate locations
    const floor = availableFloors.find((f) => f.floor === selectedFloor);
    setAvailableLocations(floor ? floor.locations : []);
    setLocation(""); // Reset location when floor changes
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      complain,
      date,
      complainBy,
      floorNo: floorNo.toString(),
      area,
      location,
      locations,
      listServices,
      materialReq,
      actionTaken,
      attendedBy: userData.name,
      remarks,
      status,
      tenantId: selectedTenant, // Include tenant ID
    };

    const response = await fetch("/api/feedbackcomplain", { // Corrected URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    console.log(body)

    if (response.ok) {
      router.push("/customer-relation/feedback-complain");
    } else {
      console.error("Error adding complaint");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
        <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">Add Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Complaint Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              <div>
                <label htmlFor="complain" className="block text-gray-700 font-semibold mb-2">Complaint</label>
                <textarea
                  id="complain"
                  value={complain}
                  onChange={(e) => setComplain(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the complaint"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
             {/* Tenant */}
             <div>
              <label htmlFor="tenant" className="block text-gray-700 font-semibold mb-2">Tenant</label>
              <select
                id="tenant"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(parseInt(e.target.value, 10))} // Convert to integer on selection
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.tenantName}
                  </option>
                ))}
              </select>

            </div>


            <div>
              <label htmlFor="area" className="block text-gray-700 font-semibold mb-2">Area</label>
              <select
                id="area"
                value={area}
                onChange={handleAreaChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Area</option>
                <option value="LRA">Lower Rise Area (LRA)</option>
                <option value="HRA">High Rise Area (HRA)</option>
              </select>
            </div>

            <div>
              <label htmlFor="floorNo" className="block text-gray-700 font-semibold mb-2">Floor No</label>
              <select
                id="floorNo"
                value={floorNo}
                onChange={handleFloorChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!availableFloors.length} // Disable if no floors are available
              >
                <option value="">Select Floor</option>
                {availableFloors.map((f) => (
                  <option key={f.floor} value={f.floor}>
                    {f.floor}
                  </option>
                ))}
              </select>
            </div>


            
            <div>
              <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Location Block</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!availableLocations.length} // Disable if no locations are available
              >
                <option value="">Select Location</option>
                {availableLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            {/* Locations Required */}
            <div>
              <label htmlFor="Locations" className="block text-gray-700 font-semibold mb-2">Location Required</label>
              <input
                type="text"
                id="locations"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            

            {/* List of Services */}
            <div>
              <label htmlFor="listServices" className="block text-gray-700 font-semibold mb-2">List of Services</label>
              <select
                id="listServices"
                value={listServices}
                onChange={(e) => setListServices(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Service</option>
                {SERVICES_LIST.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Materials Required */}
            <div>
              <label htmlFor="materialReq" className="block text-gray-700 font-semibold mb-2">Materials Required</label>
              <input
                type="text"
                id="materialReq"
                value={materialReq}
                onChange={(e) => setMaterialReq(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Action Taken */}
            <div>
              <label htmlFor="actionTaken" className="block text-gray-700 font-semibold mb-2">Action Taken</label>
              <input
                type="text"
                id="actionTaken"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Attended By */}
            <div>
              <label htmlFor="attendedBy" className="block text-gray-700 font-semibold mb-2">Attended By</label>
              <input
                type="text"
                id="attendedBy"
                value={userData?.name}
                onChange={(e) => setAttendedBy(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>

            {/* Remarks */}
            <div>
              <label htmlFor="remarks" className="block text-gray-700 font-semibold mb-2">Remarks</label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional remarks"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
