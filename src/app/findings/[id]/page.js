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

  const fetchFinding = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/findings/${id}`);
      setFinding(res?.data || null);
    } catch (err) {
      console.error(err);
      alert("Failed to load finding");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFinding();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!finding) return <p className="p-10">Data not found</p>;

  const departments = finding.departments || [];

  const filteredDepartments = fdId
    ? departments.filter(d => String(d.finding_department_id) === String(fdId))
    : departments;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {finding.finding_code}
        </h1>

        <button
          onClick={() => router.back()}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          ← Back
        </button>
      </div>

      {/* INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {finding.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {finding.description || "-"}
        </p>

        <div className="flex gap-6 flex-wrap items-center">
          <p><b>Risk:</b> {finding.risk_rating}</p>
          <p><b>Due:</b> {formatDate(finding.due_date)}</p>
          <StatusBadge status={finding.status} />
        </div>
      </div>

      {/* DEPARTMENTS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Departments & Action Plans
        </h2>

        {filteredDepartments.map(fd => {

          const plans = fd.action_plans || [];

          return (
            <div key={fd.finding_department_id} className="mb-6">

              {/* 🔥 HEADER DEPARTMENT */}
              <div className="flex justify-between items-center mb-2">

                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {fd.name || "-"}
                  </h3>

                  <p className="text-xs text-gray-400">
                    {plans.length} action plan
                  </p>
                </div>

                <StatusBadge status={fd.status} />

              </div>

              {/* 🔥 CARD */}
              <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">

                {plans.length > 0 ? (
                  plans.map(ap => {

                    const isOverdue =
                      ap.target_date &&
                      new Date(ap.target_date) < new Date() &&
                      ap.status !== "verified";

                    return (
                      <div
                        key={ap.id}
                        className={`p-4 rounded-lg mb-4 border shadow-sm ${isOverdue
                          ? "bg-red-50 border-red-300"
                          : "bg-white"
                          }`}
                      >

                        {/* ROOT CAUSE */}
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">
                            Root Cause
                          </p>
                          <p className="text-sm font-medium">
                            {ap.root_cause || "-"}
                          </p>
                        </div>

                        {/* ACTION */}
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">
                            Corrective Action
                          </p>
                          <p className="text-sm font-medium">
                            {ap.corrective_action || "-"}
                          </p>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-between items-center">

                          <p className="text-xs text-gray-500">
                            Target: {formatDate(ap.target_date)}
                          </p>

                          <StatusBadge status={ap.status} />

                        </div>

                      </div>
                    );

                  })
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    No action plan yet
                  </p>
                )}

              </div>

            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/findings/${id}/action-plans`)}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          + Add Action Plan
        </button>
      </div>

    </div>
  );
}


/* ================= STATUS ================= */

function StatusBadge({ status }) {

  const map = {
    open: "bg-blue-500",
    in_progress: "bg-yellow-500",
    pending_verify: "bg-orange-500",
    closed: "bg-green-600",

    draft: "bg-gray-500",
    submitted: "bg-blue-400",
    approved: "bg-purple-500",
    done: "bg-green-500",
    verified: "bg-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ${map[status] || "bg-gray-400"}`}>
      {status?.replaceAll("_", " ")}
    </span>
  );
}


/* ================= DATE ================= */

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}