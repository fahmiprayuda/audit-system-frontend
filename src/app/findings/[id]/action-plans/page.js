"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ActionPlansPage() {

  const { id } = useParams();
  const router = useRouter();

  const [finding, setFinding] = useState(null);
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH FINDING + INIT PLANS
  // ===============================
  useEffect(() => {
    if (!id) return;

    const fetchFinding = async () => {
      try {

        const res = await api.get(`/findings/${id}`);
        const data = res.data;

        setFinding(data);

        // 🔥 INIT PLANS
        const initialPlans = {};

        data.departments.forEach((fd) => {
          initialPlans[fd.finding_department_id] = [
            {
              root_cause: "",
              corrective_action: "",
              target_date: "",
            },
          ];
        });

        setPlans(initialPlans);

      } catch (err) {
        console.error(err);
        alert("Failed to load finding");
      }
    };

    fetchFinding();
  }, [id]);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (fdId, index, field, value) => {

    const updated = [...(plans[fdId] || [])];

    updated[index][field] = value;

    setPlans({
      ...plans,
      [fdId]: updated,
    });
  };

  // ===============================
  // ADD ROW
  // ===============================
  const addRow = (fdId) => {

    setPlans({
      ...plans,
      [fdId]: [
        ...(plans[fdId] || []), // 🔥 anti undefined
        {
          root_cause: "",
          corrective_action: "",
          target_date: "",
        },
      ],
    });
  };

  // ===============================
  // REMOVE ROW
  // ===============================
  const removeRow = (fdId, index) => {

    const updated = (plans[fdId] || []).filter((_, i) => i !== index);

    setPlans({
      ...plans,
      [fdId]: updated.length
        ? updated
        : [
            {
              root_cause: "",
              corrective_action: "",
              target_date: "",
            },
          ],
    });
  };

  // ===============================
  // SUBMIT
  // ===============================
  const submitPlans = async () => {

    setLoading(true);

    try {

      const payload = [];

      Object.keys(plans).forEach((fdId) => {
        (plans[fdId] || []).forEach((plan) => {
          payload.push({
            finding_department_id: fdId,
            root_cause: plan.root_cause,
            corrective_action: plan.corrective_action,
            target_date: plan.target_date,
          });
        });
      });

      await api.post("/action-plans/bulk", {
        finding_id: id,
        plans: payload,
      });

      alert("Action Plans created!");

      router.push(`/findings/${id}`);

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.message || "Failed to save action plans");

    } finally {
      setLoading(false);
    }
  };

  if (!finding) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-2">
        Action Plans
      </h1>

      <p className="mb-6 text-gray-600">
        {finding.title}
      </p>

      {/* OVERDUE ALERT */}
      {finding.is_overdue && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
          ⚠️ This finding is overdue
        </div>
      )}

      <div className="space-y-8">

        {finding.departments.map((fd) => (

          <div
            key={fd.finding_department_id}
            className="bg-white p-6 rounded-xl shadow"
          >

            <h2 className="text-xl font-semibold mb-4">
              {fd.department_name}
            </h2>

            <div className="space-y-4">

              {(plans[fd.finding_department_id] || []).map((plan, index) => (

                <div
                  key={index}
                  className="border p-4 rounded-lg space-y-3 relative"
                >

                  {/* REMOVE */}
                  <button
                    type="button"
                    onClick={() =>
                      removeRow(fd.finding_department_id, index)
                    }
                    className="absolute top-2 right-2 text-red-500 text-sm"
                  >
                    Remove
                  </button>

                  {/* ROOT CAUSE */}
                  <textarea
                    placeholder="Root Cause"
                    value={plan.root_cause}
                    onChange={(e) =>
                      handleChange(
                        fd.finding_department_id,
                        index,
                        "root_cause",
                        e.target.value
                      )
                    }
                    className="w-full border px-3 py-2 rounded"
                  />

                  {/* CORRECTIVE ACTION */}
                  <textarea
                    placeholder="Corrective Action"
                    value={plan.corrective_action}
                    onChange={(e) =>
                      handleChange(
                        fd.finding_department_id,
                        index,
                        "corrective_action",
                        e.target.value
                      )
                    }
                    className="w-full border px-3 py-2 rounded"
                  />

                  {/* DATE */}
                  <input
                    type="date"
                    value={plan.target_date}
                    onChange={(e) =>
                      handleChange(
                        fd.finding_department_id,
                        index,
                        "target_date",
                        e.target.value
                      )
                    }
                    className="border px-3 py-2 rounded"
                  />

                </div>
              ))}

              {/* ADD BUTTON */}
              <button
                type="button"
                onClick={() => addRow(fd.finding_department_id)}
                className="text-blue-600 text-sm"
              >
                + Add Action Plan
              </button>

            </div>
          </div>

        ))}

      </div>

      {/* SUBMIT */}
      <div className="mt-10">
        <button
          onClick={submitPlans}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Action Plans"}
        </button>
      </div>

    </div>
  );
}