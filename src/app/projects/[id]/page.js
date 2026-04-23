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

  const project = data.project;
  const findings = data.findings || [];

  // ================= DELETE =================
  const deleteProject = async () => {
    if (!confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${project.id}`);
      router.push("/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete project");
    }
  };

  const deleteDepartment = async (fdId) => {
    if (!confirm("Remove this department?")) return;

    try {
      await api.delete(`/finding-departments/${fdId}`);

      setData(prev => ({
        ...prev,
        findings: prev.findings.map(f => ({
          ...f,
          departments: f.departments.filter(
            d => d.finding_department_id !== fdId
          )
        }))
      }));

    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  // ================= SUBMIT AP =================
  const submitAP = async () => {
    if (!form.finding_id || !form.department_id) {
      return alert("Finding & Department wajib diisi");
    }

    try {
      let fdId;

      const finding = findings.find(f => f.id == form.finding_id);
      const existing = finding?.departments?.find(
        d => d.department_id == form.department_id
      );

      if (existing) {
        fdId = existing.finding_department_id;
      } else {
        const fd = await api.post("/finding-departments", {
          finding_id: form.finding_id,
          department_id: form.department_id
        });

        fdId = fd.data.id;
      }

      await api.post("/action-plans", {
        finding_department_id: fdId,
        root_cause: form.root_cause,
        corrective_action: form.corrective_action,
        target_date: form.target_date,
        status: "draft" // ✅ FIX
      });

      alert("Action Plan Created");

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
      alert("Failed create AP");
    }
  };

  // ================= SUMMARY =================
  const allDepartments = findings.flatMap(f => f.departments || []);
  const allAP = allDepartments.flatMap(d => d.action_plans || []);

  const summary = {
    findings: findings.length,
    departments: allDepartments.length,
    actionPlans: allAP.length,
    draft: allAP.filter(a => a.status === "draft").length,
    progress: allAP.filter(a => a.status === "in_progress").length,
    done: allAP.filter(a => a.status === "done").length,
    verified: allAP.filter(a => a.status === "verified").length,
  };

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
        <button onClick={() => router.back()} className="bg-yellow-400 px-4 py-2 rounded">
          ← Back
        </button>

        <button
          onClick={() => router.push(`/projects/${id}/create-finding`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Finding
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Action Plan
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
        <Card title="Findings" value={summary.findings} />
        <Card title="Departments" value={summary.departments} />
        <Card title="AP" value={summary.actionPlans} />
        <Card title="Draft" value={summary.draft} />
        <Card title="Progress" value={summary.progress} />
        <Card title="Done" value={summary.done} />
        <Card title="Verified" value={summary.verified} />
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
              <th className="p-4">Due</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {findings.flatMap(finding => {

              const depts = finding.departments?.length
                ? finding.departments
                : [{ dummy: true }];

              return depts.map((dept, idx) => {

                const fdId = dept.finding_department_id;

                return (
                  <tr
                    key={`${finding.id}-${fdId || idx}`}
                    onClick={() =>
                      fdId
                        ? router.push(`/findings/${finding.id}?fd=${fdId}`)
                        : router.push(`/findings/${finding.id}`)
                    }
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{finding.finding_code}</td>
                    <td className="p-4 font-medium">{finding.title}</td>
                    <td className="p-4">{dept.name || "-"}</td>
                    <td className="p-4">{finding.risk_rating}</td>

                    <td className="p-4">
                      <StatusBadge status={dept.status} />
                    </td>

                    <td className="p-4">
                      {formatDate(finding.due_date)}
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/findings/${finding.id}/edit`);
                        }}
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>

                      {!dept.dummy && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDepartment(fdId);
                          }}
                          className="text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      )}
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
              {findings.map(f => (
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
              <button onClick={submitAP} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* COMPONENT */
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
    open: "bg-blue-500",
    in_progress: "bg-yellow-500",
    pending_verify: "bg-orange-500",
    closed: "bg-green-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ${map[status] || "bg-gray-400"}`}
    >
      {status?.replaceAll("_", " ")}
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