"use client";

import { useEffect, useState } from "react";

import { formatDate } from "@/utils/date";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/badges/StatusBadge";
import TableSkeleton from "@/components/ui/TableSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Plus, FolderKanban, Trash2, Pencil, Calendar } from "lucide-react";


export default function ProjectsPage() {

    const router = useRouter();

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

    const [editingProject, setEditingProject] = useState(null);


    // ================= FETCH =================
    const fetchProjects = async (page = 1) => {
        try {
            setLoading(true);

            const res = await api.get(
                `/projects?page=${page}&per_page=10`
            );

            setProjects(res.data.data || []);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);

        } catch (err) {
            console.error(err);
            alert("Failed to load projects");

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

        setShowModal(true);
    };

    const updateProject = async () => {

        if (!company) return alert("Company wajib dipilih");
        if (!name.trim()) return alert("Project name wajib diisi");

        setSubmitting(true);

        try {

            await api.put(`/projects/${editingProject.id}`, {
                project_name: name.trim(),
                audit_type: editingProject.audit_type,
                release_date: releaseDate || null,
                created_by: leadAuditor ? Number(leadAuditor) : undefined,
            });

            await fetchProjects(currentPage);

            alert("Project updated successfully 🚀");

            setShowModal(false);
            setEditingProject(null);

            setName("");
            setCompany("");
            setReleaseDate("");
            setLeadAuditor("");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to update project"
            );

        } finally {

            setSubmitting(false);

        }

    };

    const closeModal = () => {

        setShowModal(false);

        setEditingProject(null);

        setName("");
        setCompany("");
        setReleaseDate("");
        setLeadAuditor("");

    };
    // ================= DELETE =================
    const deleteProject = async (projectId) => {
        if (!confirm("Delete this project?")) return;
        try {
            await api.delete(`/projects/${projectId}`);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (err) {
            alert(err.response?.data?.message || "Cannot delete project");
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
        if (!company) return alert("Company wajib dipilih");
        if (!name.trim()) return alert("Project name wajib diisi");

        setSubmitting(true);

        try {
            await api.post("/projects", {
                company_id: Number(company),
                project_name: name.trim(),
                release_date: releaseDate || null,
                created_by: leadAuditor ? Number(leadAuditor) : undefined,
            });

            await fetchProjects(currentPage);

            alert("Project created successfully 🚀");

            closeModal();   // 👈 TAMBAH INI

            setName("");
            setCompany("");
            setReleaseDate("");

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to create project"
            );

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
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
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
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEdit(project);
                                                        }}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                                        title="Edit Project"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteProject(project.id);
                                                        }}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                        title="Delete Project"
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
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm">
                    Page {currentPage} of {lastPage}
                </span>

                <button
                    disabled={currentPage === lastPage}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>

            </div>

            {/* MODAL */}

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    onClick={() => closeModal()}
                >
                    <div
                        className="bg-white p-8 rounded-2xl shadow-xl w-[500px]"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {editingProject ? "Edit Project" : "Create Project"}
                            </h2>

                            <button
                                onClick={() => closeModal()}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* PROJECT NAME */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">
                                Project Name
                            </label>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        {/* COMPANY */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">
                                Company
                            </label>

                            <select
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
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
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm">
                                    Lead Auditor / Project Head
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    (Opsional)
                                </span>
                            </div>

                            <select
                                value={leadAuditor}
                                onChange={(e) => setLeadAuditor(e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm bg-white"
                            >
                                <option value="">Otomatis (User yang sedang Login)</option>
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
                            <p className="text-[11px] text-slate-400 mt-1">
                                Pilih Lead Auditor penanggung jawab project ini, atau biarkan default (anda sendiri).
                            </p>
                        </div>

                        {/* DATE */}
                        <div className="mb-6">
                            <label className="block text-sm mb-1">
                                Release Date
                            </label>

                            <input
                                type="date"
                                value={releaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => closeModal()}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    editingProject
                                        ? updateProject
                                        : submitProject
                                }
                                disabled={submitting}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {submitting
                                    ? editingProject
                                        ? "Updating..."
                                        : "Creating..."
                                    : editingProject
                                        ? "Update"
                                        : "Create"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
            </div>
        </div>
    );
}