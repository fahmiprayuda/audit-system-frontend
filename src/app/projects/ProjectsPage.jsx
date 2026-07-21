"use client";

import { useEffect, useState } from "react";

import { formatDate } from "@/utils/date";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/badges/StatusBadge";


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

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [submitting, setSubmitting] = useState(false);


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
                console.log(err);

                console.log(err.response);

                console.log(err.message);
                alert("Failed to load companies");
            } finally {
                setLoadingCompanies(false);
            }
        };

        fetchCompanies();
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
            });

            await fetchProjects(currentPage);

            alert("Project created successfully 🚀");

            setShowModal(false);   // 👈 TAMBAH INI

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

    // ================= LOADING =================
    if (loading) {
        return <p className="p-10">Loading projects...</p>;
    }

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Audit Projects</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Create Project
                </button>
            </div>

            {/* IF IS EMPTY */}
            {projects.length === 0 && (<div className="bg-white p-6 rounded-xl shadow text-gray-500">No projects yet.</div>)}

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Project</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Release Date</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map(project => (
                            <tr
                                key={project.id}
                                onClick={(e) => {
                                    if (e.target.tagName === "BUTTON") return;
                                    router.push(`/projects/${project.id}`);
                                }}
                                className="border-b hover:bg-gray-50 cursor-pointer">
                                {/* CODE */}
                                <td className="p-4 font-medium">{project.project_code || "-"}</td>
                                {/* NAME */}
                                <td className="p-4">{project.project_name}</td>
                                {/* COMPANY */}
                                <td className="p-4">{project.company?.name || "-"}</td>
                                {/* STATUS */}
                                <td className="p-4"><StatusBadge status={project.status} /></td>
                                {/* START */}
                                <td className="p-4">{formatDate(project.release_date)}</td>
                                {/* ACTION */}
                                <td className="p-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteProject(project.id);
                                        }}
                                        className="flex items-center gap-1 px-3 py-1 rounded-md
             text-red-600 text-sm font-medium
             hover:bg-red-50 hover:text-red-700
             transition"
                                    >
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white p-8 rounded-2xl shadow-xl w-[500px]"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                Create Project
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
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
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitProject}
                                disabled={submitting}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {submitting ? "Creating..." : "Create"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>

    );
}