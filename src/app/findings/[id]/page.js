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

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAPModal, setShowAPModal] = useState(false);

  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedActionPlan, setSelectedActionPlan] = useState(null);
  const [note, setNote] = useState("");

  const [selectedFD, setSelectedFD] = useState("");

  const [form, setForm] = useState({
    root_cause: "",
    corrective_action: "",
    target_date: "",
    status: "open"
  });

  // ================= FETCH =================
  const fetchFinding = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/findings/${id}`);
      setFinding(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load finding");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchFinding();
  }, [id]);

  // ================= FILTER =================
  const filteredDepartments = fdId
    ? finding?.departments?.filter(
      (d) => String(d.finding_department_id) === String(fdId)
    )
    : finding?.departments;

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fdTarget = selectedFD || fdId;

    if (!fdTarget) {
      alert("Pilih department dulu bro");
      return;
    }

    try {
      await api.post("/action-plans", {
        ...form,
        finding_department_id: fdTarget
      });

      alert("Action Plan berhasil ditambahkan");

      setForm({
        root_cause: "",
        corrective_action: "",
        target_date: "",
        status: "open"
      });

      setSelectedFD("");
      setShowAPModal(false);

      fetchFinding();

    } catch (err) {
      console.error(err);
      alert("Failed to create action plan");
    }
  };

  // ================= VERIFICATION =================
  const submitVerification = async () => {
    try {
      await api.post("/verifications", {
        action_plan_id: selectedActionPlan,
        status: selectedAction,
        note: note
      });

      setShowVerifyModal(false);
      setNote("");
      fetchFinding();

    } catch (err) {
      alert("Failed to submit verification");
    }
  };

  // ================= RENDER =================
  if (loading) return <p className="p-10">Loading...</p>;
  if (!finding) return <p className="p-10">Data not found</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        {finding.finding_code} - Finding Detail

        {finding.is_overdue && (
          <span className="ml-3 text-red-600"> 🔴 OVERDUE</span>
        )}
      </h1>

      {/* INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">{finding.title}</h2>
        <p className="text-gray-600 mb-4">{finding.description}</p>

        <div className="flex gap-6 flex-wrap">
          <p><b>Risk:</b> {finding.risk_rating}</p>
          <p><b>Status:</b> <StatusBadge status={finding.status} /></p>
          <p><b>Due Date:</b> {formatDate(finding.due_date)}</p>
        </div>
      </div>

      {/* ACTION PLAN */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Action Plans per Department
        </h2>

        {filteredDepartments?.map((fd) => {

          const plans = fd.action_plans || [];

          return (
            <div key={fd.finding_department_id} className="border rounded-xl p-5 mb-5 bg-gray-50">

              <div className="flex justify-between mb-3">
                <h3 className="font-bold text-lg">{fd.department_name}</h3>
                <span className="text-sm text-gray-500">
                  {plans.length} Action Plan
                </span>
              </div>

              {plans.length > 0 ? (
                plans.map((ap) => (
                  <div key={ap.id} className="border p-4 rounded mb-3 bg-white">

                    <div className="flex justify-between">
                      <p className="font-semibold">{ap.corrective_action}</p>
                      <StatusBadge status={ap.status} />
                    </div>

                    <p className="text-sm text-gray-500">
                      Target: {formatDate(ap.target_date)}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedAction("approved");
                          setSelectedActionPlan(ap.id);
                          setShowVerifyModal(true);
                        }}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAction("rejected");
                          setSelectedActionPlan(ap.id);
                          setShowVerifyModal(true);
                        }}
                        className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-red-500 font-semibold">
                  ⚠️ No action plan
                </p>
              )}

            </div>
          );
        })}
      </div>

      {/* 🔥 FOOTER BUTTON */}
      <div className="mt-3 flex justify-end gap-3 pt-6">

        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/projects");
            }
          }}
          className="px-4 py-2 border rounded bg-white shadow-sm hover:bg-gray-100"
        >
          ← Back
        </button>

        <button
          onClick={() => setShowAPModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Action Plan
        </button>

      </div>

      {/* ================= MODAL ACTION PLAN ================= */}
      {showAPModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px] space-y-4">

            <h2 className="text-xl font-bold">Tambah Action Plan</h2>

            {!fdId && (
              <select
                value={selectedFD}
                onChange={(e) => setSelectedFD(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih Department</option>
                {filteredDepartments.map((fd) => (
                  <option key={fd.finding_department_id} value={fd.finding_department_id}>
                    {fd.department_name}
                  </option>
                ))}
              </select>
            )}

            <textarea name="root_cause" value={form.root_cause} onChange={handleChange} placeholder="Root cause..." className="w-full border p-2 rounded" />
            <textarea name="corrective_action" value={form.corrective_action} onChange={handleChange} placeholder="Corrective action..." className="w-full border p-2 rounded" />
            <input type="date" name="target_date" value={form.target_date} onChange={handleChange} className="w-full border p-2 rounded" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAPModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>

              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL VERIFY ================= */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-xl font-bold mb-4">Verification</h2>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Verification note..."
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowVerifyModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>

              <button onClick={submitVerification} className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* STATUS */
function StatusBadge({ status }) {
  const map = {
    open: "bg-red-500",
    need_review: "bg-yellow-500",
    completed: "bg-blue-600",
    closed: "bg-green-600"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-white text-sm ${map[status]}`}>
      {status}
    </span>
  );
}

/* DATE */
function formatDate(date) {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}