"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";

export default function useProjectDetail(id) {

    const [data, setData] = useState(null);

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    // ================= FETCH =================

    const fetchData = useCallback(async () => {

        try {

            setLoading(true);

            const [res, dept] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get("/departments")
            ]);

            setData(res?.data || null);

            setDepartments(dept?.data || []);

        } catch (err) {

            console.error(err);

            alert("Failed to load project");

        } finally {

            setLoading(false);
        }

    }, [id]);

    // ================= INITIAL FETCH =================

    useEffect(() => {

        if (!id) return;

        fetchData();

    }, [fetchData]);

    // ================= DELETE DEPARTMENT =================

    const deleteDepartment = async (fdId) => {

        if (!confirm("Remove this department?")) return;

        try {

            await api.delete(`/finding-departments/${fdId}`);

            setData(prev => ({
                ...prev,
                findings: prev.findings.map(f => ({
                    ...f,
                    departments: f.departments.filter(
                        d => d.finding_department_id !== fdId
                    )
                }))
            }));

        } catch (err) {

            console.error(err);

            alert("Failed to delete");
        }
    };

    return {

        data,
        departments,
        loading,

        fetchData,

        deleteDepartment,
        setData,
    };
}