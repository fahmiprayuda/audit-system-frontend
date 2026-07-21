"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useCompanies() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {

        try {

            setLoading(true);

            const res = await api.get("/master/companies");

            setCompanies(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchCompanies();

    }, []);

    return {
        companies,
        loading,
        fetchCompanies,
    };

}