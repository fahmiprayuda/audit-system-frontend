"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function CreateFindingPage() {

  const { id } = useParams(); // project id
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [risk, setRisk] = useState("Moderate");
  const [dueDate, setDueDate] = useState("");

  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // ===============================
  // FETCH DEPARTMENTS
  // ===============================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // ===============================
  // TOGGLE DEPARTMENT
  // ===============================
  const toggleDepartment = (deptId) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments(
        selectedDepartments.filter((id) => id !== deptId)
      );
    } else {
      setSelectedDepartments([...selectedDepartments, deptId]);
    }
  };

  // ===============================
  // SUBMIT
  // ===============================
  const submitFinding = async (e) => {
    e.preventDefault();

    if (!id) {
      alert("Project ID not found");
      return;
    }

    if (selectedDepartments.length === 0) {
      alert("Select at least 1 department");
      return;
    }

    setLoading(true);

    try {

      const res = await api.post("/findings", {
        audit_project_id: id,
        title,
        description,
        risk_rating: risk,
        due_date: dueDate,
        departments: selectedDepartments,
      });

      console.log("CREATE FINDING RESPONSE:", res.data);

      // 🔥 FIX UTAMA DI SINI
      const newFinding = res.data.data || res.data;

      if (!newFinding?.id) {
        throw new Error("Finding ID not found in response");
      }

      // 🔥 redirect ke action plan page
      router.push(`/findings/${newFinding.id}/action-plans`);

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to create finding"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Create Finding
      </h1>

      <form
        onSubmit={submitFinding}
        className="bg-white p-8 rounded-xl shadow max-w-2xl space-y-6"
      >

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Finding Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* RISK */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Risk Rating
          </label>
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Extreme">Extreme</option>
            <option value="Major">Major</option>
            <option value="Moderate">Moderate</option>
          </select>
        </div>

        {/* DUE DATE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Due Date (Global)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* DEPARTMENTS */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Departments
          </label>

          {loadingDepartments ? (
            <p className="text-gray-500 text-sm">
              Loading departments...
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {departments.map((dept) => (
                <label
                  key={dept.id}
                  className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept.id)}
                    onChange={() => toggleDepartment(dept.id)}
                  />
                  {dept.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Finding"}
        </button>

      </form>
    </div>
  );
}