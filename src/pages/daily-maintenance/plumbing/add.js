import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { FLOOR_DATA } from "../../../constant";

export default function AddPlumbingProject() {
  const [project, setProject] = useState({
    plumberId: "",
    supervisorId: "",
    locations: [],
  });
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [plumbers, setPlumbers] = useState([]);
  const router = useRouter();
  const [userId, setUserId] = useState(null); // Store the user's ID
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
    // Fetch supervisor and plumber data
    const fetchUsers = async () => {
      try {
        const [supervisorRes, plumberRes] = await Promise.all([
          fetch("/api/users/filtered?roles=Supervisor&departments=Building"),
          fetch("/api/users/filtered?roles=Technician&departments=Plumbing"),
        ]);
        const supervisorsData = await supervisorRes.json();
        const plumbersData = await plumberRes.json();
        setSupervisors(supervisorsData);
        setPlumbers(plumbersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e, key, level, index, subIndex) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setProject((prev) => {
      const updated = { ...prev };
      if (level === "project") {
        updated[key] = value;
      } else if (level === "location") {
        updated.locations[index][key] = value;
      } else if (level === "room") {
        updated.locations[index].rooms[subIndex][key] = value;
      } else if (level === "plumbingCheck") {
        updated.locations[index].rooms[subIndex].plumbingCheck[key] = value;
      }
      return updated;
    });
  };

  const handleFloorSelection = (floor) => {
    setSelectedFloor(floor);
    setSelectedLocation(null);

    const floorData = FLOOR_DATA[floor];
    if (floorData && floorData.locations.length === 1) {
      setSelectedLocation(floorData.locations[0]);
      autoPopulateLocation(floorData.locations[0], floorData.locationFloor);
    } else {
      setProject((prev) => ({
        ...prev,
        locations: [],
      }));
    }
  };

  const handleLocationSelection = (locationIndex) => {
    const floorData = FLOOR_DATA[selectedFloor];
    if (floorData) {
      const selectedLoc = floorData.locations[locationIndex];
      setSelectedLocation(selectedLoc);
      autoPopulateLocation(selectedLoc, floorData.locationFloor);
    }
  };

  const autoPopulateLocation = (selectedLoc, locationFloor) => {
    setProject((prev) => ({
      ...prev,
      locations: [
        {
          locationFloor,
          locationName: selectedLoc.locationName,
          rooms: selectedLoc.roomNames.map((roomName) => ({
            roomName,
            plumbingCheck: {
              washBasin: false,
              shower: false,
              waterTaps: false,
              commode: false,
              indianWC: false,
              englishWC: false,
              waterFlushKit: false,
              waterDrain: false,
            },
          })),
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      plumberId: project.plumberId,
      supervisorId: project.supervisorId,
      locations: project.locations.map((location) => ({
        locationFloor: location.locationFloor,
        locationName: location.locationName,
        rooms: location.rooms.map((room) => ({
          roomName: room.roomName,
          plumbingCheck: { ...room.plumbingCheck },
        })),
      })),
    };

    try {
      const res = await fetch(`/api/plumbingproject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cleanedData, createdById: userId }), // Include createdById
      });

      if (res.ok) {
        alert("Project created successfully!");
        router.push("/daily-maintenance/plumbing");
      } else {
        const errorData = await res.json();
        console.error("Error creating project:", errorData);
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Check console for details.");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-semibold mb-6">Add Plumbing Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supervisor Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Supervisor</label>
            <select
              value={project.supervisorId}
              onChange={(e) => handleChange(e, "supervisorId", "project")}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            >
              <option value="">Select Supervisor</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Plumber Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Plumber</label>
            <select
              value={project.plumberId}
              onChange={(e) => handleChange(e, "plumberId", "project")}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            >
              <option value="">Select Plumber</option>
              {plumbers.map((plumber) => (
                <option key={plumber.id} value={plumber.id}>
                  {plumber.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Select Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => handleFloorSelection(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
            >
              <option value="">Select Floor</option>
              {Object.keys(FLOOR_DATA).map((floor) => (
                <option key={floor} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          {selectedFloor && FLOOR_DATA[selectedFloor].locations.length > 1 && (
            <div className="flex flex-col">
              <label className="text-white mb-1">Select Location</label>
              <select
                value={selectedLocation ? selectedLocation.locationName : ""}
                onChange={(e) =>
                  handleLocationSelection(
                    FLOOR_DATA[selectedFloor].locations.findIndex(
                      (loc) => loc.locationName === e.target.value
                    )
                  )
                }
                className="px-4 py-2 rounded-md bg-gray-800 text-white"
              >
                <option value="">Select Location</option>
                {FLOOR_DATA[selectedFloor].locations.map((location, index) => (
                  <option key={index} value={location.locationName}>
                    {location.locationName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Locations and Rooms */}
          {project.locations.map((location, locIndex) => (
            <div key={locIndex} className="border border-gray-700 rounded-md p-4 mb-4">
              <h3 className="text-lg text-white font-semibold mb-2">
                Location: {location.locationName} (Floor: {location.locationFloor})
              </h3>
              {location.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="grid grid-cols-6 gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Room Name"
                    value={room.roomName}
                    onChange={(e) =>
                      handleChange(e, "roomName", "room", locIndex, roomIndex)
                    }
                    className="col-span-5 px-4 py-2 rounded-md bg-gray-700 text-white"
                  />
                  <div className="col-span-6 mt-2">
                    <h4 className="text-white font-semibold">Plumbing Checks</h4>
                    {Object.keys(room.plumbingCheck).map((key) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={room.plumbingCheck[key]}
                          onChange={(e) =>
                            handleChange(e, key, "plumbingCheck", locIndex, roomIndex)
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-white">{key.replace(/([A-Z])/g, " $1")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Add Project
          </button>
        </form>
      </div>
    </Layout>
  );
}
