import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import { useRouter } from "next/router";

export default function ViewDriver() {
  const router = useRouter();
  const { id } = router.query;

  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (id) fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      const response = await fetch(`/api/fleet/drivers/${id}`);
      const data = await response.json();
      setDriver(data);
    } catch (error) {
      console.error("Error fetching driver:", error);
    }
  };

  if (!driver) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{driver.name}</h1>
        <p><strong>Department:</strong> {driver.department}</p>
        <p><strong>Phone No:</strong> {driver.phoneNo}</p>
        <p><strong>CNIC:</strong> {driver.cnic}</p>
        <p><strong>Emergency Contact:</strong> {driver.emergencyContact}</p>
      </div>
    </Layout>
  );
}
