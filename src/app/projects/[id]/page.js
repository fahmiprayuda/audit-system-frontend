"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    finding_id: "",
    department_id: "",
    root_cause: "",
    corrective_action: "",
    target_date: ""
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, dept] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get("/departments")
        ]);

        setData(res?.data || null);
        setDepartments(dept?.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
      }
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <p className="p-10">Loading...</p>;

  // ================= NORMALIZE =================
  const project = data.project;

  const findings = Array.isArray(data?.findings) ? data.findings : [];

  const findingsData = findings;

  // ================= DELETE FINDING =================
  const deleteFinding = async (findingId) => {
    if (!confirm("Delete this finding?")) return;

    try {
      await api.delete(`/findings/${findingId}`);

      setData(prev => ({
        ...prev,
        findings: prev.findings.filter(f => f.id !== findingId)
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete finding");
    }
  };

  // ================= DELETE PROJECT =================
  const deleteProject = async () => {
    if (!confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${project.id}`);
      router.push("/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete project");
    }
  };

  // ================= SUBMIT ACTION PLAN =================
  const submitAP = async () => {
    if (!form.finding_id || !form.department_id) {
      return alert("Finding & Department wajib diisi");
    }

    try {
      const selectedFinding = findingsData.find(
        f => String(f.id) === String(form.finding_id)
      );

      let existing = null;

      if (selectedFinding) {
        existing = selectedFinding.departments?.find(
          d => String(d.department_id) === String(form.department_id)
        );
      }

      let fdId;

      if (existing) {
        fdId = existing.finding_department_id;
      } else {
        const fd = await api.post("/finding-departments", {
          finding_id: form.finding_id,
          department_id: form.department_id
        });

        fdId = fd?.data?.id;
      }

      await api.post("/action-plans", {
        finding_department_id: fdId,
        root_cause: form.root_cause,
        corrective_action: form.corrective_action,
        target_date: form.target_date,
        status: "open"
      });

      alert("Action Plan Created 🔥");

      setShowModal(false);

      setForm({
        finding_id: "",
        department_id: "",
        root_cause: "",
        corrective_action: "",
        target_date: ""
      });

    } catch (err) {
      console.error(err);
      alert("Failed bro");
    }
  };

  // ================= SUMMARY =================
  const totalFindings = findingsData.length;

  const allDepartments = findingsData.flatMap(f => f.departments || []);
  const totalDepartments = allDepartments.length;

  const allAP = allDepartments.flatMap(d => d.action_plans || []);

  const totalAP = allAP.length;
  const openAP = allAP.filter(ap => ap.status === "open").length;
  const reviewAP = allAP.filter(ap => ap.status === "need_review").length;
  const completedAP = allAP.filter(ap => ap.status === "completed").length;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {project.project_name}
        </h1>

        <button
          onClick={deleteProject}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Project
        </button>
      </div>

      {/* ACTION BAR */}
      <div className="flex gap-3 mb-6">

        <button
          onClick={() => router.back()}
          className="bg-yellow-400 px-4 py-2 rounded"
        >
          ← Back
        </button>

        <button
          onClick={() => router.push(`/projects/${id}/create-finding`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Finding
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Action Plan
        </button>

      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card title="Findings" value={totalFindings} />
        <Card title="Departments" value={totalDepartments} />
        <Card title="Action Plans" value={totalAP} />
        <Card title="Open AP" value={openAP} />
        <Card title="Review AP" value={reviewAP} />
        <Card title="Completed AP" value={completedAP} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Finding</th>
              <th className="p-4">Department</th>
              <th className="p-4">Risk</th>
              <th className="p-4">Status</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {findingsData.flatMap((finding) => {

              const depts = finding.departments?.length
                ? finding.departments
                : [{ dummy: true }];

              return depts.map((dept, idx) => {

                const fdId = dept.finding_department_id;

                const updateStatus = async (id, status) => {
                  try {
                    await api.put(`/findings/${id}`, {
                      status
                    });

                    setData(prev => ({
                      ...prev,
                      findings: prev.findings.map(f =>
                        f.id === id ? { ...f, status } : f
                      )
                    }));

                  } catch (err) {
                    console.error(err);
                    alert("Failed update status");
                  }
                };

                return (
                  <tr
                    key={`${finding.id}-${fdId || idx}`}
                    onClick={() => {
                      if (!fdId) {
                        router.push(`/findings/${finding.id}`);
                      } else {
                        router.push(`/findings/${finding.id}?fd=${fdId}`);
                      }
                    }}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >

                    <td className="p-4">{finding.finding_code}</td>

                    <td className="p-4 font-medium">
                      {finding.title}
                    </td>

                    <td className="p-4">
                      {dept.name || "-"}
                    </td>

                    <td className="p-4">
                      {finding.risk_rating}
                    </td>

                    <td className="p-4">
                      <select
                        value={finding.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(finding.id, e.target.value)}
                        className={`px-2 py-1 rounded text-white text-xs ${finding.status === "open"
                            ? "bg-red-500"
                            : finding.status === "need_review"
                              ? "bg-yellow-500"
                              : finding.status === "completed"
                                ? "bg-blue-600"
                                : "bg-green-600"
                          }`}
                      >
                        <option value="open">Open</option>
                        <option value="need_review">Need Review</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="p-4">
                      {formatDate(finding.due_date)}
                    </td>

                    <td className="p-4 gap-2 flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/findings/${finding.id}/edit`);
                        }}
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFinding(finding.id);
                        }}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[500px] space-y-4">

            <h2 className="text-xl font-bold">Add Action Plan</h2>

            <select
              value={form.finding_id}
              onChange={(e) => setForm({ ...form, finding_id: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Finding</option>
              {findingsData.map(f => (
                <option key={f.id} value={f.id}>
                  {f.finding_code} - {f.title}
                </option>
              ))}
            </select>

            <select
              value={form.department_id}
              onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Root Cause"
              value={form.root_cause}
              onChange={(e) => setForm({ ...form, root_cause: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <textarea
              placeholder="Corrective Action"
              value={form.corrective_action}
              onChange={(e) => setForm({ ...form, corrective_action: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              value={form.target_date}
              onChange={(e) => setForm({ ...form, target_date: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={submitAP}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* COMPONENTS */
function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    open: "bg-red-500",
    need_review: "bg-yellow-500",
    completed: "bg-blue-600",
    closed: "bg-green-600"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs ${map[status] || "bg-gray-400"}`}>
      {status}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}