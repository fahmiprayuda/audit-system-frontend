"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

import StatusBadge from "@/components/badges/StatusBadge";
import RiskBadge from "@/components/badges/RiskBadge";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ProjectDetailSkeleton from "@/components/ui/ProjectDetailSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AuditReportModal from "@/components/report/AuditReportModal";
import { useToast } from "@/context/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import useActionPlan from "@/hooks/useActionPlan";
import useProjectDetail from "@/hooks/useProjectDetail";
import { formatDate } from "@/utils/date";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Calendar,
  Building2,
  UserCheck,
  FolderKanban,
  AlertCircle,
  ListTodo,
  CheckCircle2,
  Clock,
  ShieldAlert,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();

  // Modals & Dialogs state
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [showDeleteProjectConfirm, setShowDeleteProjectConfirm] = useState(false);

  // Finding to delete
  const [findingToDelete, setFindingToDelete] = useState(null);
  const [deletingFinding, setDeletingFinding] = useState(false);

  // Form submission state
  const [submittingAP, setSubmittingAP] = useState(false);
  const [apErrorMessage, setApErrorMessage] = useState("");

  const { handleCreatePlan } = useActionPlan();

  const [form, setForm] = useState({
    finding_id: "",
    department_id: "",
    root_cause: "",
    corrective_action: "",
    due_date: null,
  });

  const {
    data,
    departments,
    loading,
    fetchData,
    deleteDepartment,
  } = useProjectDetail(id);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  const project = data?.project;
  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-8 flex items-center justify-center">
        <EmptyState
          icon={FolderKanban}
          title="Project Not Found"
          description="The requested audit project does not exist or has been removed."
          actionLabel="Back to Projects"
          onAction={() => router.push("/projects")}
        />
      </div>
    );
  }

  const findings = data?.findings || [];

  // ================= DELETE PROJECT =================
  const executeDeleteProject = async () => {
    try {
      setDeletingProject(true);
      await api.delete(`/projects/${project.id}`);
      setShowDeleteProjectConfirm(false);
      toast.success(`Project "${project.project_name}" has been deleted.`);
      router.push("/projects");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setDeletingProject(false);
    }
  };

  // ================= DELETE FINDING =================
  const executeDeleteFinding = async () => {
    if (!findingToDelete) return;
    try {
      setDeletingFinding(true);
      await api.delete(`/findings/${findingToDelete.id}`);
      toast.success(`Finding "${findingToDelete.finding_code}" deleted.`);
      setFindingToDelete(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete finding.");
    } finally {
      setDeletingFinding(false);
    }
  };

  // ================= SUBMIT ACTION PLAN =================
  const submitAP = async () => {
    setApErrorMessage("");

    if (!form.finding_id || !form.department_id) {
      setApErrorMessage("Finding & Department are required.");
      return;
    }
    if (!form.corrective_action.trim()) {
      setApErrorMessage("Corrective action is required.");
      return;
    }

    try {
      setSubmittingAP(true);
      let fdId;

      const finding = findings.find((f) => f.id == form.finding_id);
      const existing = finding?.departments?.find(
        (d) => d.department_id == form.department_id
      );

      if (existing) {
        fdId = existing.finding_department_id;
      } else {
        const fd = await api.post("/finding-departments", {
          finding_id: form.finding_id,
          department_id: form.department_id,
        });
        fdId = fd.data.id;
      }

      const success = await handleCreatePlan({
        finding_department_id: fdId,
        root_cause: form.root_cause,
        corrective_action: form.corrective_action,
        due_date: form.due_date,
      });

      if (!success) return;

      await fetchData();
      setShowModal(false);
      setForm({
        finding_id: "",
        department_id: "",
        root_cause: "",
        corrective_action: "",
        due_date: null,
      });
    } catch (err) {
      console.error(err);
      setApErrorMessage(err.response?.data?.message || "Gagal membuat Action Plan");
    } finally {
      setSubmittingAP(false);
    }
  };

  // ================= SUMMARY =================
  const allDepartments = findings.flatMap((f) => f.departments || []);
  const allAP = allDepartments.flatMap((d) => d.action_plans || []);

  const summary = {
    findings: findings.length,
    departments: new Set(allDepartments.map((d) => d.department_id)).size,
    actionPlans: allAP.length,
    in_review: allAP.filter(
      (a) => a.status === "need_further_review" || a.status === "submitted"
    ).length,
    closed: allAP.filter((a) => a.status === "closed").length,
  };

  const companyName = project.company?.name || "Internal Division";
  const leadAuditorName = project.creator?.name || project.lead_auditor || "Audit Head";

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
        </div>

        {/* HERO PROJECT HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200/80">
                  <FolderKanban className="w-3.5 h-3.5 text-sky-600" />
                  <span>{project.project_code || "AUD-PROJECT"}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{companyName}</span>
                </span>

                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 capitalize">
                  {project.audit_type || "General Audit"}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                {project.project_name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>
                    Lead Auditor: <strong className="text-slate-700">{leadAuditorName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    Release Date: <strong className="text-slate-700">{formatDate(project.release_date)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition cursor-pointer"
                title="Print or download formal audit report (PDF)"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print / PDF Report</span>
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>+ Action Plan</span>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/projects/${id}/findings/create`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Finding</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteProjectConfirm(true)}
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* METRICS & SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="Total Findings"
            value={summary.findings}
            icon={AlertCircle}
            color="text-slate-900"
            bgColor="bg-slate-50"
          />
          <StatCard
            title="Departments"
            value={summary.departments}
            icon={Building2}
            color="text-sky-700"
            bgColor="bg-sky-50"
          />
          <StatCard
            title="Action Plans"
            value={summary.actionPlans}
            icon={ListTodo}
            color="text-purple-700"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="In Review (NFR)"
            value={summary.in_review}
            icon={Clock}
            color="text-amber-700"
            bgColor="bg-amber-50"
          />
          <StatCard
            title="Closed Plans"
            value={summary.closed}
            icon={CheckCircle2}
            color="text-emerald-700"
            bgColor="bg-emerald-50"
          />
        </div>

        {/* FINDINGS TABLE CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Project Findings & Action Plans
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {findings.length} Findings
              </span>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/projects/${id}/findings/create`)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>+ New Finding</span>
            </button>
          </div>

          {findings.length === 0 ? (
            <div className="p-10">
              <EmptyState
                icon={AlertCircle}
                title="No audit findings recorded"
                description="This project currently has no audit findings. Create your first finding to assign departments and follow-up action plans."
                actionLabel="+ Create First Finding"
                onAction={() => router.push(`/projects/${id}/findings/create`)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-32">Code</th>
                    <th className="py-3.5 px-4 min-w-[240px]">Finding Title</th>
                    <th className="py-3.5 px-4">Department (PIC)</th>
                    <th className="py-3.5 px-4">Risk Rating</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings.flatMap((finding) => {
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
                          className="hover:bg-slate-50/80 transition cursor-pointer group"
                        >
                          {/* Code */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[11px]">
                              {finding.finding_code}
                            </span>
                          </td>

                          {/* Title */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                              {finding.title}
                            </div>
                            {finding.description && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {finding.description}
                              </div>
                            )}
                          </td>

                          {/* Department */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{dept.name || "All Departments"}</span>
                            </span>
                          </td>

                          {/* Risk */}
                          <td className="py-3.5 px-4">
                            <RiskBadge risk={finding.risk_rating} />
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <StatusBadge status={finding.status} />
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => router.push(`/findings/${finding.id}/edit`)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                title="Edit Finding"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setFindingToDelete(finding)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete Finding"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD ACTION PLAN MODAL */}
      {showModal && (
        <div
          onClick={() => {
            if (!submittingAP) setShowModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Action Plan</h3>
                  <p className="text-[11px] text-slate-500">
                    Add remediation action plan follow-up for this finding
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={submittingAP}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {apErrorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {apErrorMessage}
                </div>
              )}

              {/* Finding Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Target Finding <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.finding_id}
                  onChange={(e) => setForm({ ...form, finding_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                >
                  <option value="">Select Target Finding</option>
                  {findings.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.finding_code} - {f.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Department (PIC) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.department_id}
                  onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                >
                  <option value="">Select Assigned Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Root Cause */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Root Cause
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the underlying root cause of the non-compliance..."
                  value={form.root_cause}
                  onChange={(e) => setForm({ ...form, root_cause: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition resize-none"
                />
              </div>

              {/* Corrective Action */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Corrective Action <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific remediation steps to be taken..."
                  value={form.corrective_action}
                  onChange={(e) => setForm({ ...form, corrective_action: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition resize-none"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Target Due Date
                </label>
                <DatePicker
                  selected={form.due_date}
                  onChange={(date) => setForm((prev) => ({ ...prev, due_date: date }))}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select target completion date"
                  wrapperClassName="w-full"
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
              <button
                type="button"
                disabled={submittingAP}
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingAP}
                onClick={submitAP}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submittingAP && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Action Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION: DELETE PROJECT */}
      <ConfirmDialog
        isOpen={showDeleteProjectConfirm}
        onClose={() => setShowDeleteProjectConfirm(false)}
        onConfirm={executeDeleteProject}
        title="Delete Audit Project"
        message={`Are you sure you want to delete project "${project.project_name}"? All associated findings, action plans, and audit history will be permanently deleted.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
        loading={deletingProject}
      />

      {/* CONFIRMATION: DELETE FINDING */}
      <ConfirmDialog
        isOpen={Boolean(findingToDelete)}
        onClose={() => setFindingToDelete(null)}
        onConfirm={executeDeleteFinding}
        title="Delete Audit Finding"
        message={`Are you sure you want to delete finding "${findingToDelete?.finding_code}: ${findingToDelete?.title}"? All associated action plans will also be permanently removed.`}
        confirmText="Delete Finding"
        cancelText="Cancel"
        variant="danger"
        loading={deletingFinding}
      />

      {/* ONE-CLICK FORMAL AUDIT REPORT MODAL (PDF) */}
      <AuditReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        project={project}
        findings={findings}
        summary={summary}
      />
    </div>
  );
}

// Subcomponent: StatCard
function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-2xl font-extrabold text-slate-900 block tracking-tight">
          {value}
        </span>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
