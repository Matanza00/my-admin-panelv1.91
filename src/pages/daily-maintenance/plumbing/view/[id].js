import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";

export default function ViewPlumbingProject() {
  const [project, setProject] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/plumbingproject/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch project: ${res.status}`);
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) return <div className="text-white text-center p-4">Loading...</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white font-bold mb-6">Plumbing Project Details</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Project Info */}
          <div className="mb-6">
            <h2 className="text-2xl text-blue-400 font-semibold mb-4">{project.location || "Project Details"}</h2>
            <p className="text-white">
               <strong className="text-blue-300">Date:</strong> {new Date(project.date).toLocaleDateString()}
              </p>
            <p className="text-white">
              <strong className="text-blue-300">Plumber Name:</strong> {project.plumberName || "N/A"}
            </p>
            <p className="text-white">
              <strong className="text-blue-300">Supervisor Name:</strong> {project.supervisorName || "N/A"}
            </p>
         
          </div>

          {/* Locations */}
          {project.locations.map((location, locIndex) => (
            <div
              key={locIndex}
              className="bg-gray-700 p-6 rounded-lg shadow-md mb-6"
            >
              <h3 className="text-xl text-blue-300 font-semibold mb-2">
                Location: {location.locationName || "Unnamed"} (Floor: {location.locationFloor})
              </h3>
              <p className="text-white">
                <strong className="text-blue-300">Remarks:</strong> {location.remarks || "N/A"}
              </p>

              {/* Rooms */}
              <div className="mt-4">
                <h4 className="text-lg text-blue-300 font-semibold mb-2">Rooms</h4>
                {location.rooms.length > 0 ? (
                  location.rooms.map((room, roomIndex) => (
                    <div
                      key={roomIndex}
                      className="bg-gray-800 p-4 rounded-lg shadow-md mb-4"
                    >
                      <h5 className="text-md text-blue-300 font-bold mb-2">
                        Room: {room.roomName || "Unnamed"}
                      </h5>
                      

                      {/* Plumbing Checks */}
<div className="grid grid-cols-2 gap-4 mt-4 text-white">
  {[
    "washBasin",
    "shower",
    "waterTaps",
    "commode",
    "indianWC",
    "englishWC",
    "waterFlushKit",
    "waterDrain",
  ].map((check, index) => (
    <p key={index}>
      <strong className="text-blue-300">{check.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
      {room.plumbingCheck?.[check] ? "Yes" : "No"}
    </p>
  ))}
</div>

                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No rooms added yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push(`/daily-maintenance/plumbing/edit/${id}`)}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
        >
          Edit Project
        </button>
      </div>
    </Layout>
  );
}
