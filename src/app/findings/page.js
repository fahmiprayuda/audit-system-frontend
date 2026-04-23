"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function FindingsPage() {

  const router = useRouter();

  const [findings, setFindings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [risk, setRisk] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);

  // ================= FETCH DEPARTMENTS =================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);

  // ================= FETCH FINDINGS =================
  useEffect(() => {

    const fetchFindings = async () => {
      try {
        setLoading(true);

        const res = await api.get("/findings", {
          params: {
            search,
            risk_rating: risk,
            department_id: department,
            page
          }
        });

        setFindings(res?.data?.data || []);
        setPagination(res.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFindings();

  }, [search, risk, department, page]);

  if (loading) {
    return <p className="p-10">Loading findings...</p>;
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        Findings Monitoring
      </h1>

      {/* ================= FILTER ================= */}

      <div className="flex gap-4 mb-6 items-center flex-wrap">

        {/* SEARCH */}
        <input
          placeholder="Search finding..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(searchInput);
              setPage(1);
            }
          }}
          className="border px-4 py-2 rounded w-64"
        />

        <button
          onClick={() => {
            setSearch(searchInput);
            setPage(1);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>

        {/* RISK */}
        <select
          value={risk}
          onChange={(e) => {
            setRisk(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Risk</option>
          <option value="Extreme">Extreme</option>
          <option value="Major">Major</option>
          <option value="Moderate">Moderate</option>
        </select>

        {/* DEPARTMENT */}
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Department</option>

          {departments.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* RESET */}
        <button
          onClick={() => {
            setSearch("");
            setSearchInput("");
            setRisk("");
            setDepartment("");
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Project</th>
              <th className="p-4">Code</th>
              <th className="p-4">Finding</th>
              <th className="p-4">Department</th>
              <th className="p-4">Risk</th>
              <th className="p-4">Status</th>
              <th className="p-4">Due</th>
            </tr>
          </thead>

          <tbody>

            {findings.map((finding) => {

              const isOverdue =
                finding.due_date &&
                new Date(finding.due_date) < new Date() &&
                finding.status !== "closed";

              return (
                <tr
                  key={finding.id}
                  onClick={() => router.push(`/findings/${finding.id}`)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >

                  <td className="p-4 font-medium text-blue-600">
                    {finding.project?.project_code || "-"}
                  </td>

                  <td className="p-4 font-medium">
                    {finding.finding_code}
                  </td>

                  <td className="p-4">
                    {finding.title}
                  </td>

                  {/* DEPARTMENTS */}
                  <td className="p-4 flex flex-wrap gap-2">
                    {finding.departments?.length > 0 ? (
                      finding.departments.map((dept, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {dept.name}
                        </span>
                      ))
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* RISK */}
                  <td className="p-4">
                    <RiskBadge risk={finding.risk_rating} />
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <StatusBadge status={finding.status} />

                    {finding.status === "pending_verify" && (
                      <span className="ml-2 text-orange-500 font-bold">
                        ⚠️
                      </span>
                    )}
                  </td>

                  {/* DUE */}
                  <td className="p-4">
                    {formatDate(finding.due_date)}

                    {isOverdue && (
                      <span className="ml-2 text-red-600 font-bold">
                        🔴
                      </span>
                    )}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}

      {pagination && (
        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            disabled={!pagination.prev_page_url}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            disabled={!pagination.next_page_url}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

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
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ${map[status] || "bg-gray-400"}`}
    >
      {status?.replaceAll("_", " ")}
    </span>
  );
}


/* ================= RISK ================= */

function RiskBadge({ risk }) {

  const map = {
    Extreme: "bg-red-700",
    Major: "bg-orange-500",
    Moderate: "bg-yellow-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs ${map[risk] || "bg-gray-400"}`}
    >
      {risk}
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