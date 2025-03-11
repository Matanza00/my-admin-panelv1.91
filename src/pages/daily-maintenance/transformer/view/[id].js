import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../../../../components/layout';

export default function ViewTransformer() {
  const router = useRouter();
  const { id } = router.query;

  const [transformer, setTransformer] = useState(null);
  const [previousTransformer, setPreviousTransformer] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/transformer/${id}`)
        .then((res) => res.json())
        .then(({ transformer, previousTransformer }) => {
          setTransformer(transformer);
          setPreviousTransformer(previousTransformer);
        })
        .catch((error) => console.error("Failed to fetch transformer data:", error));
    }
  }, [id]);
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return `${formattedDate} Time: ${time}`;
  }
  if (!transformer) return <p className="text-center text-lg">Loading...</p>;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Transformer Details</h1>

        <form className="space-y-4">
          <div>
            <label className="block font-medium">Transformer Name:</label>
            <p className="w-full p-2 border rounded bg-gray-200">{transformer.transformerNo || "N/A"}</p>
          </div>

          <div>
  <label className="block font-medium">Date:</label>
  <p className="w-full p-2 border rounded bg-gray-200">
    {transformer.date ? formatDate(transformer.date) : "N/A"}
  </p>
</div>

          {/* HISTORY Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">History</h2>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-medium">Last Maintenance:</label>
                <p className="w-full p-2 border rounded bg-gray-200">
                  {previousTransformer?.lastMaintenance
                    ? new Date(previousTransformer.lastMaintenance).toISOString().split("T")[0]
                    : "N/A"}
                </p>
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Last Dehydration:</label>
                <p className="w-full p-2 border rounded bg-gray-200">
                  {previousTransformer?.lastDehydration
                    ? new Date(previousTransformer.lastDehydration).toISOString().split("T")[0]
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* FUTURE Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Future</h2>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-medium">Next Maintenance:</label>
                <p className="w-full p-2 border rounded bg-gray-200">
                  {transformer.nextMaintenance
                    ? new Date(transformer.nextMaintenance).toISOString().split("T")[0]
                    : "N/A"}
                </p>
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Next Dehydration:</label>
                <p className="w-full p-2 border rounded bg-gray-200">
                  {transformer.nextDehydration
                    ? new Date(transformer.nextDehydration).toISOString().split("T")[0]
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Temperature (°C):</label>
              <p className="w-full p-2 border rounded bg-gray-200">{transformer.temp || "N/A"}</p>
            </div>

            <div>
              <label className="block font-medium">Temperature Status:</label>
              <p className="w-full p-2 border rounded bg-gray-300">{transformer.tempStatus || "N/A"}</p>
            </div>

            <div>
              <label className="block font-medium">HT Voltage (kV):</label>
              <p className="w-full p-2 border rounded bg-gray-200">{transformer.HTvoltage || "N/A"}</p>
            </div>

            <div>
              <label className="block font-medium">HT Voltage Status:</label>
              <p className="w-full p-2 border rounded bg-gray-300">{transformer.HTStatus || "N/A"}</p>
            </div>

            <div>
              <label className="block font-medium">LT Voltage (kV):</label>
              <p className="w-full p-2 border rounded bg-gray-200">{transformer.LTvoltage || "N/A"}</p>
            </div>

            <div>
              <label className="block font-medium">LT Voltage Status:</label>
              <p className="w-full p-2 border rounded bg-gray-300">{transformer.LTStatus || "N/A"}</p>
            </div>
          </div>

          <div>
            <label className="block font-medium">Supervisor:</label>
            <p className="w-full p-2 border rounded bg-gray-200">
              {transformer.engineerName || "Unknown"} {/* Displaying engineer name */}
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/daily-maintenance/transformer')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Back to Transformers List
          </button>
        </div>
      </div>
    </Layout>
  );
}
