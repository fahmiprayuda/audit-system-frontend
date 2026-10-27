"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/badges/StatusBadge";
import RiskBadge from "@/components/badges/RiskBadge";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ActionPlanCard from "@/components/ActionPlanCard";
import { formatDate } from "@/utils/date";
import useFindingDetail from "@/hooks/useFindingDetail";
import useActionPlan from "@/hooks/useActionPlan";
import { getUser, canManageActionPlan } from "@/utils/auth";
import {
  User,
  Building2,
  Calendar,
  FolderGit2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";


export default function FindingDetailPage() {

    const user = getUser();
    const canCreateActionPlan = canManageActionPlan();

    const { id } = useParams();
    const searchParams = useSearchParams();
    const apId = searchParams.get("ap");
    const fdId = searchParams.get("fd");

    const [showAllPlans, setShowAllPlans] = useState(false);

    const router = useRouter();

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

        showApprove,
        setShowApprove,

        showModal,
        setShowModal,

        showHistory,
        setShowHistory,

        newPlan,
        setNewPlan,

        handleSubmit,
        handleSubmitRevision,
        handleAction,
        handleComment,

        workflowAction,
        setWorkflowAction,

        fetchFinding,

        showExtend,
        setShowExtend,
        extensionData,
        setExtensionData,
        handleExtend,

    } = useFindingDetail(id, fdId, apId);

    if (loading) return <p className="p-10">Loading...</p>;
    if (!finding) return <p className="p-10">Not found</p>;

    const departments = finding.departments || [];

    const filteredDepartments = fdId
        ? departments.filter(d => String(d.finding_department_id) === String(fdId))
        : departments;

    const visibleActionPlans = (plans) => {

        if (showAllPlans || !apId) {
            return plans;
        }

        const filtered = plans.filter(
            ap => ap.id === Number(apId)
        );

        return filtered.length
            ? filtered
            : plans;
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] px-10 py-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    {finding.project && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <Link
                                href={`/projects/${finding.project.id}`}
                                className="hover:text-blue-600 flex items-center gap-1.5 transition font-medium"
                            >
                                <FolderGit2 size={14} className="text-blue-600" />
                                <span>Project: <strong className="text-slate-700">{finding.project.project_code}</strong> — {finding.project.project_name}</span>
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
                            {finding.finding_code}
                        </h1>

                        <StatusBadge status={finding.status} />
                    </div>
                </div>

                <button
                    onClick={() => router.back()}
                    className="border border-slate-300 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 transition flex items-center gap-2 text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            {/* INFO CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-10">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                            {finding.title}
                        </h2>

                        <p className="text-slate-600 mt-2.5 text-sm leading-relaxed">
                            {finding.description}
                        </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-semibold uppercase">Risk:</span>
                            <RiskBadge risk={finding.risk_rating} />
                        </div>

                        {fdId && canCreateActionPlan && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer"
                            >
                                + Add Action Plan
                            </button>
                        )}
                    </div>
                </div>

                {/* CREATOR & PROJECT OWNERSHIP METADATA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <User size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Finding Logged By</p>
                            <p className="text-xs font-semibold text-slate-800 truncate">
                                {finding.creator?.name || "Rian Pratama (Senior Auditor)"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Project Lead / Head</p>
                            <p className="text-xs font-semibold text-slate-800 truncate">
                                {finding.project?.creator?.name || "Audrey Kurniawan (Audit Head)"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Building2 size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Company Entity</p>
                            <p className="text-xs font-semibold text-slate-800 truncate">
                                {finding.project?.company?.name || "FKS Food Sejahtera"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <Calendar size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Audit Date</p>
                            <p className="text-xs font-semibold text-slate-800">
                                {formatDate(finding.created_at || finding.project?.release_date)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= DEPARTMENTS ================= */}

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <h2 className="font-bold text-xl text-slate-700 tracking-tight">
                        Departments & Action Plans
                    </h2>
                    <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {filteredDepartments.map(fd => {
                    const allPlans = fd.action_plans || [];
                    const plans = visibleActionPlans(allPlans);

                    return (
                        <div
                            key={fd.finding_department_id}
                            className="mb-8 bg-slate-50/80 border border-slate-200 rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {fd.name}
                                        </h3>
                                        {fd.code && (
                                            <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono font-semibold">
                                                {fd.code}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                                        <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                                            <User size={13} className="text-blue-500" />
                                            <span>Department PIC: <strong>{fd.pic_name || (fd.pics?.[0]?.name) || `${fd.name} PIC`}</strong></span>
                                        </span>
                                        <span>•</span>
                                        {apId && !showAllPlans ? (
                                            <span>Showing {plans.length} of {allPlans.length} Action Plans</span>
                                        ) : (
                                            <span>{allPlans.length} Action Plans</span>
                                        )}
                                    </div>
                                </div>

                                {apId && allPlans.length > 1 && (

                                    <button
                                        onClick={() => setShowAllPlans(prev => !prev)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        {showAllPlans
                                            ? "← Focus Selected Action Plan"
                                            : "View All →"}
                                    </button>

                                )}

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
                                        handleComment={handleComment}
                                        handleSubmitRevision={handleSubmitRevision}
                                        showApprove={showApprove}
                                        setShowApprove={setShowApprove}
                                        showExtend={showExtend}
                                        setShowExtend={setShowExtend}
                                        showHistory={showHistory}
                                        setShowHistory={setShowHistory}
                                        workflowAction={workflowAction}
                                        setWorkflowAction={setWorkflowAction}
                                        extensionData={extensionData}
                                        setExtensionData={setExtensionData}
                                        handleExtend={handleExtend}
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

                            <DatePicker
                                selected={newPlan.due_date}
                                onChange={(date) =>
                                    setNewPlan(prev => ({
                                        ...prev,
                                        due_date: date,
                                    }))
                                }
                                dateFormat="dd MMM yyyy"
                                placeholderText="Select due date"
                                wrapperClassName="w-full"
                                className="w-full border border-slate-300 px-4 py-3 rounded-xl"
                            />

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
                                            due_date: null,
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