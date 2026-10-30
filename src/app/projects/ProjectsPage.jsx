"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/badges/StatusBadge";
import TableSkeleton from "@/components/ui/TableSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { Plus, FolderKanban, Trash2, Pencil, Calendar, X, Building2, User, Loader2 } from "lucide-react";

export default function ProjectsPage() {
    const router = useRouter();
    const toast = useToast();

    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [leadAuditor, setLeadAuditor] = useState("");
    const [auditors, setAuditors] = useState([]);

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const [editingProject, setEditingProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // ================= FETCH =================
    const fetchProjects = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/projects?page=${page}&per_page=10`);
            setProjects(res.data.data || []);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load audit projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage]);

    const openEdit = (project) => {
        setEditingProject(project);
        setName(project.project_name.replace(/^.+? - /, ""));
        setCompany(project.company_id);
        setReleaseDate(project.release_date || "");
        setLeadAuditor(project.created_by || "");
        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setName("");
        setCompany("");
        setReleaseDate("");
        setLeadAuditor("");
        setFormError("");
    };

    const updateProject = async () => {
        if (!company) {
            setFormError("Please select a target company.");
            return;
        }
        if (!name.trim()) {
            setFormError("Project name is required.");
            return;
        }

        setSubmitting(true);
        setFormError("");

        try {
            await api.put(`/projects/${editingProject.id}`, {
                project_name: name.trim(),
                audit_type: editingProject.audit_type,
                release_date: releaseDate || null,
                created_by: leadAuditor ? Number(leadAuditor) : undefined,
            });

            await fetchProjects(currentPage);
            toast.success("Audit project updated successfully.");
            closeModal();
        } catch (err) {
            console.error(err);
            setFormError(err.response?.data?.message || "Failed to update project.");
        } finally {
            setSubmitting(false);
        }
    };

    // ================= DELETE =================
    const executeDeleteProject = async () => {
        if (!projectToDelete) return;
        setDeleting(true);
        setDeleteError("");
        try {
            await api.delete(`/projects/${projectToDelete.id}`);
            setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
            toast.success(`Project "${projectToDelete.project_name}" has been deleted.`);
            setProjectToDelete(null);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Cannot delete project.";
            setDeleteError(msg);
            toast.error(msg, "Action Blocked");
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get("/master/companies");
                setCompanies(res.data || []);
            } catch (err) {
                console.error("Failed to load companies", err);
            } finally {
                setLoadingCompanies(false);
            }
        };

        const fetchAuditors = async () => {
            try {
                const res = await api.get("/users");
                const staff = (res.data || []).filter(u => ["manager", "auditor"].includes(u.role));
                setAuditors(staff);
            } catch (err) {
                console.error("Failed to load auditors list", err);
            }
        };

        fetchCompanies();
        fetchAuditors();
    }, []);

    // ================= SUBMIT =================
    const submitProject = async () => {
        if (!company) {
            setFormError("Please select a target company.");
            return;
        }
        if (!name.trim()) {
            setFormError("Project name is required.");
            return;
        }

        setSubmitting(true);
        setFormError("");

        try {
            await api.post("/projects", {
                company_id: Number(company),
                project_name: name.trim(),
                release_date: releaseDate || null,
                created_by: leadAuditor ? Number(leadAuditor) : undefined,
            });

            await fetchProjects(currentPage);
            toast.success("New audit project created successfully.");
            closeModal();
        } catch (err) {
            console.error(err);
            setFormError(err.response?.data?.message || "Failed to create project.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Audit Projects
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage audit engagements, scheduled releases & company scopes
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            closeModal();
                            setShowModal(true);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span>Create Project</span>
                    </button>
                </div>

                {/* TABLE / SKELETON / EMPTY STATE */}
                {loading ? (
                    <TableSkeleton rows={5} cols={6} />
                ) : projects.length === 0 ? (
                    <EmptyState
                        icon={FolderKanban}
                        title="No audit projects yet"
                        description="Start by creating an annual, quarterly, or ad-hoc audit project."
                        actionLabel="+ Create Project"
                        onAction={() => setShowModal(true)}
                    />
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="p-4">Project Code</th>
                                        <th className="p-4">Project Name</th>
                                        <th className="p-4">Company</th>
                                        <th className="p-4">Lead Auditor</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Release Date</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {projects.map((project) => (
                                        <tr
                                            key={project.id}
                                            onClick={(e) => {
                                                if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
                                                router.push(`/projects/${project.id}`);
                                            }}
                                            className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                                        >
                                            {/* CODE */}
                                            <td className="p-4 font-mono text-xs font-semibold text-blue-600">
                                                {project.project_code || "-"}
                                            </td>
                                            {/* NAME */}
                                            <td className="p-4 font-semibold text-slate-900">
                                                {project.project_name}
                                            </td>
                                            {/* COMPANY */}
                                            <td className="p-4 text-slate-600">
                                                {project.company?.name || "-"}
                                            </td>
                                            {/* LEAD AUDITOR / CREATOR */}
                                            <td className="p-4 text-xs font-medium text-slate-700">
                                                {project.creator?.name || "Audrey Kurniawan (Audit Head)"}
                                            </td>
                                            {/* STATUS */}
                                            <td className="p-4">
                                                <StatusBadge status={project.status} />
                                            </td>
                                            {/* START */}
                                            <td className="p-4 text-slate-500 text-xs">
                                                {formatDate(project.release_date)}
                                            </td>
                                            {/* ACTION */}
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(project)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                                        title="Edit Project"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDeleteError("");
                                                            setProjectToDelete(project);
                                                        }}
                                                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                                                            (project.findings_count || 0) > 0
                                                                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                                                : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                        }`}
                                                        title={
                                                            (project.findings_count || 0) > 0
                                                                ? `Project has ${project.findings_count} finding(s) (cannot be deleted)`
                                                                : "Delete Project"
                                                        }
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PAGINATION */}
                <div className="flex justify-center items-center gap-3 mt-4">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white rounded-lg disabled:opacity-50 hover:bg-slate-50 transition cursor-pointer"
                    >
                        Prev
                    </button>

                    <span className="text-xs text-slate-500">
                        Page {currentPage} of {lastPage}
                    </span>

                    <button
                        type="button"
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white rounded-lg disabled:opacity-50 hover:bg-slate-50 transition cursor-pointer"
                    >
                        Next
                    </button>
                </div>

                {/* CREATE / EDIT MODAL */}
                {showModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
                        onClick={closeModal}
                    >
                        <div
                            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* HEADER */}
                            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                        <FolderKanban className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">
                                            {editingProject ? "Edit Audit Project" : "Create Audit Project"}
                                        </h2>
                                        <p className="text-[11px] text-slate-500">
                                            Configure project scope, company association, and lead auditor
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* BODY */}
                            <div className="p-6 space-y-4">
                                {formError && (
                                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                                        {formError}
                                    </div>
                                )}

                                {/* PROJECT NAME */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 block">
                                        Project Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Annual IT Infrastructure Audit 2026"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                                    />
                                </div>

                                {/* COMPANY */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 block">
                                        Company / Target Entity <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.code} - {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* LEAD AUDITOR / PROJECT OWNER */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-slate-700 block">
                                            Lead Auditor / Project Head
                                        </label>
                                        <span className="text-[11px] text-slate-400">
                                            (Optional)
                                        </span>
                                    </div>

                                    <select
                                        value={leadAuditor}
                                        onChange={(e) => setLeadAuditor(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                                    >
                                        <option value="">Default (Currently Logged-in User)</option>
                                        {auditors.map((u) => {
                                            const cleanName = u.name.replace(/\s*\([^)]*\)/g, "").trim();
                                            const roleTitle = u.level || (u.role === "manager" ? "Audit Head" : "Senior Auditor");
                                            return (
                                                <option key={u.id} value={u.id}>
                                                    {cleanName} ({roleTitle})
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <p className="text-[11px] text-slate-400">
                                        Assign the Lead Auditor responsible for this engagement, or keep default.
                                    </p>
                                </div>

                                {/* RELEASE DATE */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 block">
                                        Scheduled Release Date
                                    </label>
                                    <input
                                        type="date"
                                        value={releaseDate}
                                        onChange={(e) => setReleaseDate(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={editingProject ? updateProject : submitProject}
                                    disabled={submitting}
                                    className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                                >
                                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>
                                        {submitting
                                            ? editingProject
                                                ? "Updating..."
                                                : "Creating..."
                                            : editingProject
                                            ? "Save Changes"
                                            : "Create Project"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODERN CONFIRMATION / BLOCKED DIALOG: DELETE PROJECT */}
                {projectToDelete && (projectToDelete.findings_count || 0) > 0 ? (
                    <ConfirmDialog
                        isOpen={Boolean(projectToDelete)}
                        onClose={() => {
                            setProjectToDelete(null);
                            setDeleteError("");
                        }}
                        onConfirm={() => {
                            setProjectToDelete(null);
                            setDeleteError("");
                        }}
                        title="Cannot Delete Project"
                        message={`Project "${projectToDelete.project_name}" cannot be deleted because it currently contains ${projectToDelete.findings_count} audit finding(s). You must resolve or delete all associated findings and action plans before this project can be removed.`}
                        confirmText="Understood"
                        variant="warning"
                        showCancel={false}
                    />
                ) : (
                    <ConfirmDialog
                        isOpen={Boolean(projectToDelete)}
                        onClose={() => {
                            setProjectToDelete(null);
                            setDeleteError("");
                        }}
                        onConfirm={executeDeleteProject}
                        title="Delete Audit Project"
                        message={`Are you sure you want to delete project "${projectToDelete?.project_name}"? All associated audit trails will be permanently removed.`}
                        confirmText="Delete Project"
                        cancelText="Cancel"
                        variant="danger"
                        loading={deleting}
                        error={deleteError}
                    />
                )}
            </div>
        </div>
    );
}
