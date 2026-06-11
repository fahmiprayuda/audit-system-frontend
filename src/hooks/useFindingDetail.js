"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useFindingDetail(id, fdId) {
    const [finding, setFinding] = useState(null);
    const [loading, setLoading] = useState(true);

    const [expandedPlan, setExpandedPlan] = useState(null);

    const [files, setFiles] = useState({});

    const [showApprove, setShowApprove] = useState(null);

    const [comments, setComments] = useState({});

    const [showModal, setShowModal] = useState(false);

    const [newPlan, setNewPlan] = useState({
        finding_department_id: fdId || "",
        root_cause: "",
        corrective_action: "",
        due_date: null,
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

            const res = await api.get(
                `/findings/${id}`,
                {
                    params: {
                        fd: fdId,
                    },
                }
            );

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

    const handleComment = async (actionPlanId) => {

        const formData = new FormData();

        formData.append(
            "message",
            comments[actionPlanId]
        );

        (files[actionPlanId] || []).forEach(file => {
            formData.append(
                "attachments[]",
                file
            );
        });

        await api.post(
            `/action-plans/${actionPlanId}/comment`,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        setComments(prev => ({
            ...prev,
            [actionPlanId]: ""
        }));

        setFiles(prev => ({
            ...prev,
            [actionPlanId]: []
        }));

        fetchFinding();
    };

    return {
        finding,
        loading,

        expandedPlan,
        setExpandedPlan,

        comments,
        setComments,

        files,
        setFiles,

        showModal,
        setShowModal,

        showApprove,
        setShowApprove,

        newPlan,
        setNewPlan,

        handleAction,
        handleComment,

        fetchFinding,
    };

}