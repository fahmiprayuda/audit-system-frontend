"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useActionPlanMonitoring() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {

            setLoading(true);

            const res = await api.get(
                "/dashboard/action-plan-monitoring"
            );

            setData(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("HOOK RUN");
        fetchData();
    }, []);

    return {
        data,
        loading,
        fetchData,
    };
}