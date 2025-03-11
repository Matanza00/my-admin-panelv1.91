import { useState } from "react";
import Layout from "../../../components/layout";
import { useRouter } from "next/router";

export default function AddCar() {
  const [form, setForm] = useState({
    plate: "",
    vinNo: "",
    color: "",
    make: "",
    model: "",
    year: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/fleet/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/fleet/cars");
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Add Car</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={key}
              className="border p-2 rounded-md w-full"
            />
          ))}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add Car
          </button>
        </form>
      </div>
    </Layout>
  );
}
