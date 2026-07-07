import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useOverview(filters) {

    const [data, setData] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const fetchOverview = async () => {

        setLoading(true);

        try {

            const res = await api.get(
                "/dashboard-overview",
                {
                    params: filters,
                }
            );

            setData(res.data);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchOverview();

    }, [
        filters.start_date,
        filters.end_date
    ]);

    return {
        data,
        loading,
        fetchOverview,
    };
}