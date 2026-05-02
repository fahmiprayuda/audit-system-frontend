"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function FindingDetailPage() {

  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fdId = searchParams.get("fd");

  const [finding, setFinding] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState({});
  const [rejectComments, setRejectComments] = useState({});
  const [showReject, setShowReject] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    root_cause: "",
    corrective_action: "",
    target_date: "",
  });

  /* ================= FETCH ================= */

  const fetchFinding = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/findings/${id}`);
      setFinding(res?.data || null);
    } catch (err) {
      console.error(err);
      alert("Failed load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFinding();
  }, [id]);

  /* ================= ACTION ================= */

  const handleSubmit = async (ap) => {
    try {
      await api.post(`/action-plans/${ap.id}/submit`, {
        auditee_comment: comments[ap.id] || ""
      });

      setComments(prev => ({ ...prev, [ap.id]: "" }));
      fetchFinding();

    } catch (err) {
      console.error(err);
      alert("Submit gagal");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/action-plans/${id}/reject`, {
        comment: rejectComments[id]
      });

      setShowReject(null);
      fetchFinding();

    } catch (err) {
      console.error(err);
      alert("Reject gagal");
    }
  };

  const handleAction = async (type, id) => {
    try {
      await api.post(`/action-plans/${id}/${type}`);
      fetchFinding();
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const handleCreatePlan = async () => {

    if (!fdId) {
      alert("Pilih department dulu bro");
      return;
    }

    if (!newPlan.corrective_action.trim()) {
      alert("Corrective action wajib diisi");
      return;
    }

    try {

      await api.post("/action-plans", {
        root_cause: newPlan.root_cause || null,
        corrective_action: newPlan.corrective_action,
        target_date: newPlan.target_date || null,
        finding_department_id: Number(fdId),
        status: "draft"
      });

      setShowModal(false);

      setNewPlan({
        root_cause: "",
        corrective_action: "",
        target_date: ""
      });

      fetchFinding();

    } catch (err) {
      console.error("CREATE ERROR:", err.response?.data);
      alert("Create gagal");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!finding) return <p className="p-10">Not found</p>;

  const departments = finding.departments || [];

  const filteredDepartments = fdId
    ? departments.filter(d => String(d.finding_department_id) === String(fdId))
    : departments;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">{finding.finding_code}</h1>
        <button onClick={() => router.back()} className="bg-gray-300 px-3 py-1 rounded">
          Back
        </button>
      </div>

      {/* INFO */}
      <div className="bg-white p-6 rounded-xl mb-6">
        <h2 className="text-lg font-semibold">{finding.title}</h2>
        <p className="text-gray-500">{finding.description}</p>

        <div className="mt-3 flex gap-4 items-center">
          <span>Risk: {finding.risk_rating}</span>
          <span>Due: {formatDate(finding.due_date)}</span>
          <StatusBadge status={finding.status} />
        </div>
      </div>

      {/* ================= DEPARTMENTS ================= */}

      <div className="bg-white p-6 rounded-xl">

        <div className="flex justify-between mb-4 items-center">
          <h2 className="font-semibold">Departments & Action Plans</h2>

          {fdId && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Add Action Plan
            </button>
          )}
        </div>

        {filteredDepartments.map(fd => {

          const plans = fd.action_plans || [];

          return (
            <div key={fd.finding_department_id} className="mb-6">

              <h3 className="font-semibold">{fd.name}</h3>

              <div className="space-y-4 mt-3">

                {plans.map(ap => (
                  <div key={ap.id} className="border p-4 rounded bg-white">

                    <p><b>Root Cause:</b> {ap.root_cause || "-"}</p>
                    <p><b>Action:</b> {ap.corrective_action}</p>

                    {/* CHAT */}
                    <div className="mt-3 space-y-2">
                      {(ap.comments || []).map((c, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded text-xs max-w-[70%] ${c.role === "auditor"
                            ? "bg-red-100"
                            : "bg-blue-100 ml-auto"
                            }`}
                        >
                          <b>{c.role}</b>
                          <p>{c.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* INPUT */}
                    {(ap.status === "draft" || ap.status === "need_revision") && (
                      <textarea
                        className="w-full border mt-2 p-2"
                        placeholder="comment..."
                        value={comments[ap.id] || ""}
                        onChange={(e) =>
                          setComments(prev => ({
                            ...prev,
                            [ap.id]: e.target.value
                          }))
                        }
                      />
                    )}

                    {/* REJECT */}
                    {showReject === ap.id && (
                      <div className="mt-2 bg-red-50 p-2 rounded">
                        <textarea
                          className="w-full border p-2"
                          placeholder="reason..."
                          value={rejectComments[ap.id] || ""}
                          onChange={(e) =>
                            setRejectComments(prev => ({
                              ...prev,
                              [ap.id]: e.target.value
                            }))
                          }
                        />

                        <button
                          onClick={() => handleReject(ap.id)}
                          className="bg-red-600 text-white px-3 py-1 mt-2 rounded"
                        >
                          Submit Revision
                        </button>
                      </div>
                    )}

                    {/* ACTION */}
                    <div className="flex gap-2 mt-3 items-center flex-wrap">

                      <StatusBadge status={ap.status || "draft"} />

                      {(ap.status === "draft" || ap.status === "need_revision") && (
                        <button
                          onClick={() => handleSubmit(ap)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Submit
                        </button>
                      )}

                      {ap.status === "submitted" && (
                        <>
                          <button
                            onClick={() => handleAction("approve", ap.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              setShowReject(showReject === ap.id ? null : ap.id)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Revision
                          </button>
                        </>
                      )}

                      {ap.status === "done" && (
                        <button
                          onClick={() => handleAction("verify", ap.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Verify
                        </button>
                      )}

                    </div>

                  </div>
                ))}

              </div>

            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-[400px]">

            <h3 className="mb-3 font-semibold">Add Action Plan</h3>

            <textarea
              placeholder="Root Cause"
              className="w-full border p-2 mb-2"
              value={newPlan.root_cause}
              onChange={(e) =>
                setNewPlan({ ...newPlan, root_cause: e.target.value })
              }
            />

            <textarea
              placeholder="Corrective Action"
              className="w-full border p-2 mb-2"
              value={newPlan.corrective_action}
              onChange={(e) =>
                setNewPlan({ ...newPlan, corrective_action: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2 mb-2"
              value={newPlan.target_date}
              onChange={(e) =>
                setNewPlan({ ...newPlan, target_date: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleCreatePlan}
                className="bg-blue-600 text-white px-3 py-1 rounded"
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

/* ================= STATUS ================= */

function StatusBadge({ status }) {

  const map = {
    draft: "bg-gray-500",
    submitted: "bg-blue-400",
    approved: "bg-purple-500",
    in_progress: "bg-yellow-500",
    done: "bg-green-500",
    verified: "bg-green-700",
    need_revision: "bg-red-600",
  };

  return (
    <span className={`px-2 py-1 text-white text-xs rounded ${map[status] || "bg-gray-400"}`}>
      {status ? status.replaceAll("_", " ") : "-"}
    </span>
  );
}

/* ================= DATE ================= */

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}