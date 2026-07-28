"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function useEditFinding() {

    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [project, setProject] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        risk: "Moderate",
    });

    // ===============================
    // FETCH FINDING
    // ===============================

    useEffect(() => {

        const fetchFinding = async () => {

            try {

                const res = await api.get(`/findings/${id}`);

                const finding = res.data;

                // Header
                setProject(finding.project);

                // Form
                setForm({
                    title: finding.title,
                    description: finding.description ?? "",
                    risk: finding.risk_rating,
                });

            } catch (err) {

                console.error(err);

                alert("Failed to load finding.");

            } finally {

                setLoading(false);

            }

        };

        if (id) {

            fetchFinding();

        }

    }, [id]);

    // ===============================
    // SUBMIT
    // ===============================

    const submitFinding = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = {

                title: form.title,

                description: form.description,

                risk_rating: form.risk,

            };

            await api.put(
                `/findings/${id}`,
                payload
            );

            alert("Finding updated successfully!");

            router.push(
                `/projects/${project.id}`
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ??
                "Failed to update finding."
            );

        } finally {

            setLoading(false);

        }

    };

    return {

        loading,

        project,

        form,
        setForm,

        submitFinding,

    };

}