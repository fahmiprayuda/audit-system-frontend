"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useActionPlanMonitoring() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async (
        startDate = null,
        endDate = null
    ) => {
        try {

            setLoading(true);

            const res = await api.get(
                "/dashboard/action-plan-monitoring",
                {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    },
                }
            );

            console.log(res.data);

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