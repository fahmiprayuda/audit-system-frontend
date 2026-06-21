"use client";

import api from "@/lib/axios";

import { formatDateForApi } from "@/utils/date";

export default function useActionPlan() {

    const handleCreatePlan = async ({
        finding_department_id,
        root_cause,
        corrective_action,
        due_date,
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

                due_date: formatDateForApi(due_date),

                status: "need_further_review",
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