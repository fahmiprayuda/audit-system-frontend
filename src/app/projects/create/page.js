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

  // ===============================
  // FETCH COMPANIES
  // ===============================
  useEffect(() => {

    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load companies");
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();

  }, []);

  // ===============================
  // SUBMIT
  // ===============================
  const submitProject = async (e) => {
    e.preventDefault();

    // 🔥 VALIDASI DATE
    if (startDate && endDate && endDate < startDate) {
      alert("End date cannot be earlier than start date");
      return;
    }

    setSubmitting(true);

    try {

      await api.post("/projects", {
        company_id: company,
        project_name: name,
        start_date: startDate,
        end_date: endDate,
      });

      router.push("/projects");

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.message || "Failed to create project");

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Create Audit Project
      </h1>

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
            <p className="text-gray-500 text-sm">Loading companies...</p>
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