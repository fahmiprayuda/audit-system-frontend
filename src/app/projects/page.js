"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {

  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

  }, []);

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

  // ================= LOADING =================
  if (loading) {
    return <p className="p-10">Loading projects...</p>;
  }

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Audit Projects
        </h1>

        <button
          onClick={() => router.push("/projects/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Project
        </button>

      </div>

      {/* EMPTY */}
      {projects.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No projects yet.
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Project</th>
              <th className="p-4">Company</th>
              <th className="p-4">Status</th>
              <th className="p-4">Start</th>
              <th className="p-4">End</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {projects.map(project => (

              <tr
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >

                {/* CODE */}
                <td className="p-4 font-medium">
                  {project.project_code || "-"}
                </td>

                {/* NAME */}
                <td className="p-4">
                  {project.project_name}
                </td>

                {/* COMPANY */}
                <td className="p-4">
                  {project.company?.name || "-"}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <StatusBadge status={project.status} />
                </td>

                {/* START */}
                <td className="p-4">
                  {formatDate(project.start_date)}
                </td>

                {/* END */}
                <td className="p-4">
                  {formatDate(project.end_date)}
                </td>

                {/* ACTION */}
                <td className="p-4">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({ status }) {

  let color = "bg-gray-400";

  if (status === "open") color = "bg-blue-500";
  if (status === "in_progress") color = "bg-yellow-500";
  if (status === "closed") color = "bg-green-600";

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs ${color}`}>
      {status}
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