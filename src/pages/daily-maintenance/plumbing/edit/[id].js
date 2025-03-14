import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import { FLOOR_DATA } from "../../../../constant";

export default function EditPlumbingProject() {
  const [project, setProject] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState("");
  // const [selectedLocation, setSelectedLocation] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [plumbers, setPlumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  // Fetch project details and user data
  // Fetch project details and user data
  useEffect(() => {
    const fetchUsersAndProject = async () => {
      try {
        // Fetch users for dropdowns
        const [supervisorRes, plumberRes] = await Promise.all([
          fetch("/api/users/filtered?roles=Supervisor&departments=Building"),
          fetch("/api/users/filtered?roles=Technician&departments=Plumbing"),
        ]);
  
        if (!supervisorRes.ok || !plumberRes.ok) {
          throw new Error("Error fetching user data");
        }
  
        const supervisorsData = await supervisorRes.json();
        const plumbersData = await plumberRes.json();
        setSupervisors(supervisorsData);
        setPlumbers(plumbersData);
  
        // Fetch project data after dropdown data is ready
        if (id) {
          const projectRes = await fetch(`/api/plumbingproject/${id}`);
          if (!projectRes.ok) throw new Error(`Failed to fetch project: ${projectRes.status}`);
          const projectData = await projectRes.json();
  
          // Match names with IDs for dropdowns
          const plumberMatch = plumbersData.find((plumber) => plumber.name === projectData.plumberName);
          const supervisorMatch = supervisorsData.find((supervisor) => supervisor.name === projectData.supervisorName);
  
          setProject({
            ...projectData,
            plumberName: plumberMatch ? plumberMatch.id.toString() : "", // Match id for dropdown
            supervisorName: supervisorMatch ? supervisorMatch.id.toString() : "", // Match id for dropdown
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsersAndProject();
  }, [id]);
  
  
  


  const handleChange = (e, key, level, index, subIndex) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setProject((prev) => {
      const updated = { ...prev };
      if (level === "project") updated[key] = value;
      else if (level === "location") updated.locations[index][key] = value;
      else if (level === "room") updated.locations[index].rooms[subIndex][key] = value;
      else if (level === "plumbingCheck") updated.locations[index].rooms[subIndex].plumbingCheck[key] = value;
      return updated;
    });
  };

  const handleFloorSelection = (floor) => {
    setSelectedFloor(floor);
    const floorData = FLOOR_DATA[floor];
    if (floorData?.locations?.length > 0) {
      // const firstLocation = floorData.locations[0];
      // setSelectedLocation(firstLocation);
    } else {
      // setSelectedLocation(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/plumbingproject/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        alert("Project updated successfully!");
        router.push(`/daily-maintenance/plumbing`);
      } else {
        const errorData = await res.json();
        console.error("Error updating project:", errorData);
        alert("Failed to update project. Check console for details.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Check console for details.");
    }
  };

  if (loading) return <div>Loading project data...</div>;
  if (!project) return <div>No project found.</div>;
  console.log("project",project);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-semibold mb-6">Edit Plumbing Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown for Plumber Name */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Plumber</label>
            <select
              value={project.plumberName} // Ensures the dropdown shows the correct pre-selected plumber
              onChange={(e) => handleChange(e, "plumberName", "project")}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            >
              <option value="">Select Plumber</option>
              {plumbers.map((plumber) => (
                <option key={plumber.id} value={plumber.id.toString()}>
                  {plumber.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown for Supervisor Name */}
          <div className="flex flex-col">
            <label className="text-white mb-1">Supervisor</label>
            <select
              value={project.supervisorName} // Ensures the dropdown shows the correct pre-selected supervisor
              onChange={(e) => handleChange(e, "supervisorName", "project")}
              className="px-4 py-2 rounded-md bg-gray-800 text-white"
              required
            >
              <option value="">Select Supervisor</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id.toString()}>
                  {supervisor.name}
                </option>
              ))}
            </select>
          </div>


{/* Floor Selection (View-Only) */}
<div className="flex flex-col">
  <label className="text-white mb-1">Selected Floor</label>
  <div className="px-4 py-2 rounded-md bg-gray-800 text-white">
    {project?.locations?.[0]?.locationFloor || "No floor selected"}
  </div>
</div>



          {/* Locations */}
          <div>
            <h3 className="text-white mb-2">Locations and Rooms</h3>
            {project.locations.map((location, locIndex) => (
              <div key={locIndex} className="border border-gray-700 rounded-md p-4 mb-4">
                <div className="flex flex-col">
                  <label className="text-white mb-1">Remarks</label>
                  <textarea
                    value={location.remarks || ""}
                    onChange={(e) => handleChange(e, "remarks", "location", locIndex)}
                    className="px-4 py-2 rounded-md bg-gray-800 text-white"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <h4 className="text-white font-semibold">Rooms</h4>
                  {location.rooms.map((room, roomIndex) => (
                    <div key={roomIndex} className="grid grid-cols-6 gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Room Name"
                        value={room.roomName}
                        onChange={(e) => handleChange(e, "roomName", "room", locIndex, roomIndex)}
                        className="col-span-5 px-4 py-2 rounded-md bg-gray-700 text-white"
                      />
                     <div className="col-span-6 mt-2">
                      <h5 className="text-white">Plumbing Checks</h5>
                      {Object.keys(room.plumbingCheck)
                        .filter((key) => key !== "id" && key !== "roomId") // Exclude "id" & "roomId"
                        .map((key) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={room.plumbingCheck[key]}
                              onChange={(e) => handleChange(e, key, "plumbingCheck", locIndex, roomIndex)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-white">{key.replace(/([A-Z])/g, " $1")}</span>
                          </label>
                        ))}
                    </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
          >
            Update Project
          </button>
        </form>
      </div>
    </Layout>
  );
}
