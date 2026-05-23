"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useFindingDetail(id, fdId) {
    const [finding, setFinding] = useState(null);
    const [loading, setLoading] = useState(true);

    const [expandedPlan, setExpandedPlan] = useState(null);

    const [files, setFiles] = useState({});

    const [comments, setComments] = useState({});
    const [rejectComments, setRejectComments] = useState({});

    const [showReject, setShowReject] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [newPlan, setNewPlan] = useState({
        finding_department_id: fdId || "",
        root_cause: "",
        corrective_action: "",
        start_date: null,
        target_date: null,
    });

    useEffect(() => {
        if (fdId) {
            setNewPlan(prev => ({
                ...prev,
                finding_department_id: fdId
            }));
        }
    }, [fdId]);

    const fetchFinding = async () => {
        try {

            setLoading(true);

            const res = await api.get(`/findings/${id}`);

            setFinding(res.data);

        } catch (err) {

            console.error(err);

            alert("Failed load");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchFinding();
        }
    }, [id]);

    const handleSubmit = async (ap) => {

        const message =
            comments[ap.id] || rejectComments[ap.id];

        if (!message?.trim()) {
            alert("Comment wajib diisi");
            return;
        }

        try {

            const formData = new FormData();

            formData.append(
                "auditee_comment",
                message
            );

            Array.from(files[ap.id] || [])
                .forEach(file => {

                    formData.append(
                        "evidences[]",
                        file
                    );

                });

            await api.post(
                `/action-plans/${ap.id}/submit`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            setComments(prev => ({
                ...prev,
                [ap.id]: ""
            }));

            setRejectComments(prev => ({
                ...prev,
                [ap.id]: ""
            }));

            setFiles(prev => ({
                ...prev,
                [ap.id]: []
            }));

            fetchFinding();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Error"
            );
        }
    };

    const handleSubmitRevision = async (ap) => {

        const message = rejectComments[ap.id];

        if (!message) {
            alert("Comment wajib diisi");
            return;
        }

        try {

            await api.post(`/action-plans/${ap.id}/reject`, {
                message,
            });

            setRejectComments((prev) => ({
                ...prev,
                [ap.id]: "",
            }));

            setShowReject(null);

            fetchFinding();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Gagal submit revisi"
            );
        }
    };

    const handleAction = async (type, id) => {
        try {

            await api.post(`/action-plans/${id}/${type}`);

            fetchFinding();

        } catch (err) {

            console.error(
                err.response?.data || err.message
            );

            alert("Failed");
        }
    };

    return {
        finding,
        loading,

        expandedPlan,
        setExpandedPlan,

        comments,
        setComments,

        rejectComments,
        setRejectComments,

        files,
        setFiles,

        showReject,
        setShowReject,

        showModal,
        setShowModal,

        newPlan,
        setNewPlan,

        handleSubmit,
        handleSubmitRevision,
        handleAction,

        fetchFinding,
    };
}