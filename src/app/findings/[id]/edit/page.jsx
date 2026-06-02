"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function EditFindingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    risk_rating: "",
    start_date: ""
  });

  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [findingRes, deptRes] = await Promise.all([
          api.get(`/findings/${id}`),
          api.get("/departments"),
        ]);

        const finding = findingRes.data;

        setDepartments(deptRes.data || []);

        setForm({
          title: finding.title,
          description: finding.description,
          risk_rating: finding.risk_rating,
          start_date: finding.start_date || "",
        });


      } catch (err) {
        console.error(err);
        alert("Failed load finding");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/findings/${id}`, form);

      alert("Updated 🔥");
      router.back();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Edit Finding
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl space-y-4 max-w-xl">

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <textarea
          value={form.description || ""}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <select
          value={form.risk_rating}
          onChange={(e) => setForm({ ...form, risk_rating: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="Extreme">Extreme</option>
          <option value="Major">Major</option>
          <option value="Moderate">Moderate</option>
        </select>

        <input
          type="date"
          value={form.start_date || ""}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>

      </form>
    </div>
  );
}