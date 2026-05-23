"use client";

import api from "@/lib/axios";

export default function useActionPlan() {

    const handleCreatePlan = async ({
        finding_department_id,
        root_cause,
        corrective_action,
        start_date,
        target_date,
    }) => {

        if (!corrective_action?.trim()) {
            alert("Corrective action wajib diisi");
            return false;
        }

        try {

            await api.post("/action-plans", {

                finding_department_id,

                root_cause: root_cause || null,

                corrective_action,

                start_date: start_date
                    ? start_date.toISOString().split("T")[0]
                    : null,

                target_date: target_date
                    ? target_date.toISOString().split("T")[0]
                    : null,

                status: "draft"
            });

            return true;

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Action Plan gagal dibuat, pastikan semua data sudah benar."
            );

            return false;
        }
    };

    return {
        handleCreatePlan,
    };
}