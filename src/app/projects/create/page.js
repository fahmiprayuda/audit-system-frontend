"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function CreateProjectPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies");
        setCompanies(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load companies");
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // ================= SUBMIT =================
  const submitProject = async (e) => {
    e.preventDefault();

    if (!company) return alert("Company wajib dipilih");
    if (!name.trim()) return alert("Project name wajib diisi");

    if (startDate && endDate && endDate < startDate) {
      return alert("End date tidak boleh sebelum start date");
    }

    setSubmitting(true);

    try {
      await api.post("/projects", {
        company_id: Number(company),
        project_name: name.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
      });

      alert("Project created successfully 🚀");

      router.push("/projects");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to create project"
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Create Audit Project
        </h1>

        <button
          onClick={() => router.back()}
          className="bg-yellow-400 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={submitProject}
        className="bg-white p-8 rounded-xl shadow max-w-2xl space-y-6"
      >

        {/* PROJECT NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: General Audit 2026"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* COMPANY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company
          </label>

          {loadingCompanies ? (
            <p className="text-gray-500 text-sm">
              Loading companies...
            </p>
          ) : (
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Company</option>

              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Project"}
        </button>

      </form>

    </div>
  );
}