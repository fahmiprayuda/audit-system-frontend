"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import StatusBadge from "@/components/badges/StatusBadge";
import RiskBadge from "@/components/badges/RiskBadge";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ActionPlanCard from "@/components/ActionPlanCard";
import { formatDate } from "@/utils/date";
import useFindingDetail from "@/hooks/useFindingDetail";
import useActionPlan from "@/hooks/useActionPlan";
import { getUser, canManageActionPlan } from "@/utils/auth";


export default function FindingDetailPage() {

  //const userRole = "auditor"; // hardcoded for testing, should be from auth context or similar
  //const userRole = "auditee"; // hardcoded for testing, should be from auth context or similar

  const user = getUser();
  const canCreateActionPlan = canManageActionPlan();

  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fdId = searchParams.get("fd");

  const { handleCreatePlan } = useActionPlan();

  const {
    finding,
    loading,

    expandedPlan,
    setExpandedPlan,

    comments,
    setComments,

    rejectComments,
    setRejectComments,

    files,
    setFiles,

    showReject,
    setShowReject,

    showModal,
    setShowModal,

    newPlan,
    setNewPlan,

    handleSubmit,
    handleSubmitRevision,
    handleAction,

    fetchFinding,

  } = useFindingDetail(id, fdId);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!finding) return <p className="p-10">Not found</p>;

  const departments = finding.departments || [];

  const filteredDepartments = fdId
    ? departments.filter(d => String(d.finding_department_id) === String(fdId))
    : departments;

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-10 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {finding.finding_code}
          </h1>

          <StatusBadge status={finding.status} />
        </div>

        <button
          onClick={() => router.back()}
          className="border border-slate-300 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>

      {/* INFO */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-10">
        <h2 className="text-2xl font-semibold text-slate-900">
          {finding.title}
        </h2>

        <p className="text-slate-500 mt-2">
          {finding.description}
        </p>

        <div className="flex gap-8 mt-8 items-center">
          <span className="text-slate-500">
            Risk:
          </span>

          <RiskBadge risk={finding.risk_rating} />

          <span className="text-slate-500">
            Start Date:
          </span>

          <span className="font-semibold">
            {formatDate(finding.start_date)}
          </span>

          {fdId && canCreateActionPlan && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-right ml-auto"
            >
              + Add Action Plan
            </button>
          )}

        </div>
      </div>

      {/* ================= DEPARTMENTS ================= */}

      <div className="bg-white p-6 rounded-xl">


        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-slate-200"></div>

          <h1 className="font-semibold text-3xl text-slate-500">
            Departments & Action Plans
          </h1>

          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {filteredDepartments.map(fd => {

          const plans = fd.action_plans || [];

          return (
            <div
              key={fd.finding_department_id}
              className="mb-10 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm"
            >

              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {fd.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {plans.length} Action Plan
                  </p>
                </div>

              </div>

              <div className="space-y-2">
                {plans.map(ap => (
                  <ActionPlanCard
                    key={ap.id}
                    ap={ap}
                    expandedPlan={expandedPlan}
                    setExpandedPlan={setExpandedPlan}
                    comments={comments}
                    setComments={setComments}
                    rejectComments={rejectComments}
                    setRejectComments={setRejectComments}
                    files={files}
                    setFiles={setFiles}
                    handleSubmit={handleSubmit}
                    handleAction={handleAction}
                    handleSubmitRevision={handleSubmitRevision}
                    showReject={showReject}
                    setShowReject={setShowReject}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}

      {
        showModal && (
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl border border-slate-200">


              <h3 className="mb-3 font-semibold">Add Action Plan</h3>

              <label className="mt-6 block text-sm font-medium">
                Root Cause <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Root Cause"
                className="w-full border p-2 mb-2"
                value={newPlan.root_cause}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, root_cause: e.target.value })
                }
              />

              <label className="block text-sm font-medium">
                Corrective Action <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Corrective Action"
                className="w-full border p-2 mb-2"
                value={newPlan.corrective_action}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, corrective_action: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Timeline
                </label>

                <DatePicker
                  selectsRange
                  startDate={newPlan.start_date}
                  endDate={newPlan.target_date}
                  onChange={(dates) => {
                    const [start, end] = dates;

                    setNewPlan((prev) => ({
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

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="border px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {

                    const success = await handleCreatePlan(newPlan);

                    if (!success) return;

                    alert("Action Plan berhasil dibuat");

                    await fetchFinding();

                    setShowModal(false);

                    setNewPlan({
                      finding_department_id: fdId || "",
                      root_cause: "",
                      corrective_action: "",
                      start_date: null,
                      target_date: null,
                    });

                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        )
      }

    </div >
  );
}