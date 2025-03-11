import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import { useRouter } from "next/router";

export default function EditDriver() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    age: "",
    department: "",
    phoneNo: "",
    cnic: "",
    emergencyContact: "",
  });

  useEffect(() => {
    if (id) fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      const response = await fetch(`/api/fleet/drivers/${id}`);
      const data = await response.json();
      setForm(data);
    } catch (error) {
      console.error("Error fetching driver:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/fleet/drivers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/fleet/drivers");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Driver</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
        {Object.keys(form)
            .filter((key) => key !== "id" && key !== "createdAt" && key !== "updatedAt" && key !== "cars") // Exclude fields
            .map((key) => (
            <input
                key={key}
                type="text"
                name={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={key.replace(/([A-Z])/g, " $1").trim()} // Format placeholder
                className="border p-2 rounded-md w-full"
            />
            ))}
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
            Update Driver
        </button>
        </form>
      </div>
    </Layout>
  );
}
