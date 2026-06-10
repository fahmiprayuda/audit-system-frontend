"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

import StatusBadge from "@/components/badges/StatusBadge";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import useActionPlan from "@/hooks/useActionPlan";
import useProjectDetail from "@/hooks/useProjectDetail";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const { handleCreatePlan } = useActionPlan();

  const [form, setForm] = useState({
    finding_id: "",
    department_id: "",
    root_cause: "",
    corrective_action: "",
    start_date: null,
    target_date: null
  });

  const {
    data,
    departments,
    loading,
    fetchData,
    deleteDepartment,
  } = useProjectDetail(id);


  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

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

  // ================= SUBMIT AP =================
  const submitAP = async () => {

    if (!form.finding_id || !form.department_id) {
      return alert("Finding & Department wajib diisi");
    }

    try {

      let fdId;

      const finding = findings.find(
        f => f.id == form.finding_id
      );

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

      const success = await handleCreatePlan({
        finding_department_id: fdId,
        root_cause: form.root_cause,
        corrective_action: form.corrective_action,
        start_date: form.start_date,
        target_date: form.target_date,
      });

      if (!success) return;

      alert("Action Plan berhasil dibuat !! 🔥");

      await fetchData();

      setShowModal(false);

      setForm({
        finding_id: "",
        department_id: "",
        root_cause: "",
        corrective_action: "",
        start_date: null,
        target_date: null
      });

    } catch (err) {

      console.error(err);

      alert("Failed create AP");
    }
  };

  const deleteFinding = async (id) => {
    const ok = confirm(
      "Delete this finding? Related action plans will also be removed."
    );

    if (!ok) return;

    try {
      await api.delete(`/findings/${id}`);

      await fetchData();

      alert("Finding deleted 🔥");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
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
    submitted: allAP.filter(a => a.status === "submitted").length,
    needRevision: allAP.filter(a => a.status === "need_revision").length,
    approved: allAP.filter(a => a.status === "approved").length,
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
        <Card title="Draft / Open" value={summary.draft} />
        <Card title="NFR" value={summary.submitted} />
        <Card title="Closed" value={summary.approved} />
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
                      <StatusBadge status={finding.status} />
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
                            deleteFinding(finding.id);
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
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl w-[500px] space-y-4">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Action Plan</h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>


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

            <label className="mt-6 block text-sm font-medium">
              Root Cause <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Root Cause"
              value={form.root_cause}
              onChange={(e) => setForm({ ...form, root_cause: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <label className="block text-sm font-medium">
              Corrective Action <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Corrective Action"
              value={form.corrective_action}
              onChange={(e) => setForm({ ...form, corrective_action: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Timeline
              </label>

              <DatePicker
                selectsRange
                startDate={form.start_date}
                endDate={form.target_date}
                onChange={(dates) => {
                  const [start, end] = dates;

                  setForm((prev) => ({
                    ...prev,
                    start_date: start,
                    target_date: end,
                  }));
                }}
                isClearable
                monthsShown={2}
                dateFormat="dd MMM yyyy"
                placeholderText="Select timeline"
                wrapperClassName="w-full"
                className="w-full border border-slate-300 px-4 py-3 rounded-xl"
              />

            </div>

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

function formatDate(date) {
  if (!date) return "-";

  // kalau string dari DB: YYYY-MM-DD
  if (typeof date === "string") {
    const [year, month, day] = date.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // kalau Date object
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}