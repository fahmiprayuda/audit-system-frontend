"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { formatDateForApi } from "@/utils/date";

export default function useCreateFinding() {

    const { id } = useParams();
    const router = useRouter();

    const [project, setProject] = useState(null);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        risk_rating: "Moderate",
    });

    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [actionPlans, setActionPlans] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data.project);
                setDepartments(res.data.project.company.departments);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDepartments(false);
            }
        };
        if (id) {
            fetchProject();
        }
    }, [id]);

    const toggleDepartment = (deptId) => {
        deptId = String(deptId);

        if (selectedDepartments.includes(deptId)) {
            // REMOVE
            setSelectedDepartments(prev => prev.filter(id => id !== deptId));

            const updated = { ...actionPlans };
            delete updated[deptId];
            setActionPlans(updated);

        } else {
            // ADD
            setSelectedDepartments(prev => [...prev, deptId]);

            setActionPlans(prev => ({
                ...prev,
                [deptId]: {
                    root_cause: "",
                    corrective_action: "",
                    due_date: "",
                }
            }));
        }
    };

    const handleAPChange = (deptId, field, value) => {
        setActionPlans({
            ...actionPlans,
            [deptId]: {
                ...actionPlans[deptId],
                [field]: value
            }
        });
    };

    const submitFinding = async (e) => {
        e.preventDefault();

        if (!id) return alert("Project ID not found");

        if (selectedDepartments.length === 0) {
            return alert("Select at least 1 department");
        }

        for (let deptId of selectedDepartments) {
            const ap = actionPlans[deptId];

            if (!ap?.corrective_action?.trim()) {
                return alert("Semua department wajib punya corrective action");
            }

        }

        setLoading(true);

        try {

            const payload = {
                audit_project_id: Number(id),

                title: form.title,
                description: form.description,
                risk_rating: form.risk,

                departments: selectedDepartments.map(Number),

                action_plans: selectedDepartments.map((deptId) => ({
                    department_id: Number(deptId),

                    root_cause:
                        actionPlans[deptId]?.root_cause || "",

                    corrective_action:
                        actionPlans[deptId]?.corrective_action || "",

                    due_date: formatDateForApi(
                        actionPlans[deptId]?.due_date
                    ),
                }))
            };

            console.log("PAYLOAD:", payload);

            await api.post("/findings", payload);

            alert("Finding + Action Plan created 🚀");

            router.push(`/projects/${id}`);

        } catch (err) {

            console.log(err.response?.data);

            alert(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Failed to create finding"
            );

        } finally {
            setLoading(false);
        }
    };

    return {
        project,
        departments,
        form,
        setForm,
        selectedDepartments,
        setSelectedDepartments,
        actionPlans,
        setActionPlans,
        loading,
        loadingDepartments,
        toggleDepartment,
        handleAPChange,
        submitFinding
    }
}