"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function CreateFindingPage() {

  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [risk, setRisk] = useState("Moderate");
  const [dueDate, setDueDate] = useState("");

  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  // 🔥 ACTION PLAN STATE
  const [actionPlans, setActionPlans] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // ================= TOGGLE =================
  const toggleDepartment = (deptId) => {
    deptId = String(deptId);

    if (selectedDepartments.includes(deptId)) {
      // REMOVE
      setSelectedDepartments(prev => prev.filter(id => id !== deptId));

      const updated = { ...actionPlans };
      delete updated[deptId];
      setActionPlans(updated);

    } else {
      // ADD
      setSelectedDepartments(prev => [...prev, deptId]);

      setActionPlans(prev => ({
        ...prev,
        [deptId]: {
          root_cause: "",
          corrective_action: "",
          target_date: ""
        }
      }));
    }
  };

  // ================= HANDLE AP =================
  const handleAPChange = (deptId, field, value) => {
    setActionPlans({
      ...actionPlans,
      [deptId]: {
        ...actionPlans[deptId],
        [field]: value
      }
    });
  };

  // ================= SUBMIT =================
  const submitFinding = async (e) => {
    e.preventDefault();

    if (!id) return alert("Project ID not found");
    if (selectedDepartments.length === 0)
      return alert("Select at least 1 department");

    // 🔥 VALIDASI AP
    for (let deptId of selectedDepartments) {
      const ap = actionPlans[deptId];

      if (!ap?.corrective_action) {
        return alert("Semua department wajib punya corrective action");
      }
    }

    setLoading(true);

    try {
      await api.post("/findings", {
        audit_project_id: id,
        title,
        description,
        risk_rating: risk,
        due_date: dueDate,

        // 🔥 departments
        departments: selectedDepartments.map(Number),

        // 🔥 action plans langsung
        action_plans: selectedDepartments.map((deptId) => ({
          department_id: Number(deptId),
          root_cause: actionPlans[deptId]?.root_cause || "",
          corrective_action: actionPlans[deptId]?.corrective_action || "",
          target_date: actionPlans[deptId]?.target_date || null,
        })),
      });

      alert("Finding + Action Plan created 🚀");

      router.push(`/projects/${id}`);

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

      <h1 className="text-3xl font-bold mb-6">
        Create Finding
      </h1>

      <form
        onSubmit={submitFinding}
        className="bg-white p-8 rounded-xl shadow max-w-3xl space-y-6"
      >

        {/* TITLE */}
        <input
          placeholder="Finding Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {/* RISK */}
        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Extreme">Extreme</option>
          <option value="Major">Major</option>
          <option value="Moderate">Moderate</option>
        </select>

        {/* DUE DATE */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {/* DEPARTMENTS */}
        <div>
          <h3 className="font-semibold mb-2">Departments</h3>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {departments.map((dept) => {
              const checked = selectedDepartments.includes(String(dept.id));

              return (
                <div
                  key={dept.id}
                  onClick={() => toggleDepartment(dept.id)}
                  className={`border p-2 rounded cursor-pointer ${checked ? "bg-blue-100 border-blue-400" : ""
                    }`}
                >
                  {dept.name}
                </div>
              );
            })}
          </div>

          {/* 🔥 ACTION PLAN AUTO FORM */}
          {selectedDepartments.map((deptId) => {

            const dept = departments.find(d => String(d.id) === deptId);
            const ap = actionPlans[deptId];

            return (
              <div key={deptId} className="border p-4 rounded mb-4 bg-gray-50">

                <h4 className="font-bold mb-2">
                  {dept?.name}
                </h4>

                <textarea
                  placeholder="Root Cause"
                  value={ap?.root_cause || ""}
                  onChange={(e) =>
                    handleAPChange(deptId, "root_cause", e.target.value)
                  }
                  className="w-full border p-2 rounded mb-2"
                />

                <textarea
                  placeholder="Corrective Action *"
                  value={ap?.corrective_action || ""}
                  onChange={(e) =>
                    handleAPChange(deptId, "corrective_action", e.target.value)
                  }
                  className="w-full border p-2 rounded mb-2"
                  required
                />

                <input
                  type="date"
                  value={ap?.target_date || ""}
                  onChange={(e) =>
                    handleAPChange(deptId, "target_date", e.target.value)
                  }
                  className="border p-2 rounded"
                />

              </div>
            );
          })}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Finding"}
        </button>

      </form>

    </div>
  );
}