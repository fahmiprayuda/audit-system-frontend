"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [riskData, setRiskData] = useState([]);
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const summaryRes = await api.get("/dashboard-summary");
        const riskRes = await api.get("/findings-by-risk");
        const overdueRes = await api.get("/findings-overdue");

        setSummary(summaryRes.data);

        // FIX: pastikan array
        setRiskData(Array.isArray(riskRes.data) ? riskRes.data : []);

        setOverdue(Array.isArray(overdueRes.data) ? overdueRes.data : []);

      } catch (err) {

        console.error(err);
        alert("Failed to load dashboard");

      }

    };

    fetchDashboard();

  }, []);

  if (!summary) {
    return <p className="p-10">Loading dashboard...</p>;
  }

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Audit Monitoring Dashboard
      </h1>

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-5 gap-6 mb-10">

        <Card title="Total Findings" value={summary.total || 0} />

        <Card title="Open" value={summary.open || 0} color="red" />

        <Card title="Need Review" value={summary.need_review || 0} color="yellow" />

        <Card title="Closed" value={summary.closed || 0} color="green" />

        <Card title="Overdue" value={summary.overdue || 0} color="orange" />

      </div>


      {/* ================= RISK CHART ================= */}

      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Findings by Risk Rating
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={riskData}>

            {/* FIX: pakai risk_rating */}
            <XAxis dataKey="risk_rating" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="total" />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* ================= OVERDUE ================= */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          Overdue Findings
        </h2>

        {overdue.length === 0 ? (

          <p className="text-gray-500">
            No overdue findings 🎉
          </p>

        ) : (

          <ul className="space-y-3">

            {overdue.map((f) => (

              <li key={f.id} className="border p-3 rounded">

                <p className="font-medium">

                {f.finding_code} - {f.title}

                <span className="ml-2 text-red-600 font-bold">
                🔴 OVERDUE
                </span>

                </p>

                <p className="text-sm text-gray-500">
                  Due Date: {formatDate(f.due_date)}
                </p>

              </li>

            ))}

          </ul>

        )}

      </div>

    </div>

  );

}


/* ================= CARD ================= */

function Card({ title, value, color }) {

  const colors = {
    red: "text-red-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
    orange: "text-orange-600"
  };

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <p className="text-gray-500 mb-2">
        {title}
      </p>

      <h2 className={`text-3xl font-bold ${colors[color] || ""}`}>
        {value}
      </h2>

    </div>

  );

}


/* ================= DATE FORMAT ================= */

function formatDate(date){

if(!date) return "-"

return new Date(date).toLocaleDateString("en-GB",{
day:"2-digit",
month:"short",
year:"numeric"
})

function isOverdue(finding){

if(!finding.due_date) return false

return (
finding.status !== "closed" &&
new Date(finding.due_date) < new Date()
)

}

}