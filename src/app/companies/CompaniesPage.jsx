"use client";

import api from "@/lib/axios";

import { Building2, Plus } from "lucide-react";

import { useState } from "react";

import useCompanies from "@/app/companies/hooks/useCompanies";

import DepartmentFormModal from "@/app/companies/components/DepartmentFormModal";
import DepartmentModal from "@/app/companies/components/DepartmentModal";
import CompanyCard from "@/app/companies/components/CompanyCard";
import CompanyModal from "@/app/companies/components/CompanyModal";

export default function CompaniesPage() {

    const [showModal, setShowModal] =
        useState(false);

    const [showDelete, setShowDelete] =
        useState(false);

    const [showDepartments, setShowDepartments] =
        useState(false);

    const {

        companies,
        loading,
        fetchCompanies,

    } = useCompanies();

    const [selectedCompany, setSelectedCompany] =
        useState(null);

    const deleteCompany = async (company) => {

        if (
            !confirm(
                `Delete "${company.name}"?`
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/master/companies/${company.id}`
            );

            fetchCompanies();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ??
                "Failed to delete company."
            );

        }

    };

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Companies
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage company master data.
                    </p>

                </div>

                <button
                    onClick={() => {
                        setSelectedCompany(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                    <Plus size={20} />
                    Add Company
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Loading */}

                {loading && (

                    <div className="col-span-full py-20 text-center">

                        Loading...

                    </div>

                )}

                {/* Empty State */}

                {!loading && companies.length === 0 && (

                    <div className="col-span-full bg-white rounded-3xl border border-dashed border-slate-300 py-20 text-center">

                        <Building2
                            size={42}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-5 text-xl font-semibold">
                            No Companies
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Create your first company to get started.
                        </p>

                    </div>

                )}

                {/* Company Cards */}

                {!loading && companies.map(company => (

                    <CompanyCard
                        key={company.id}
                        company={company}
                        onManage={(company) => {
                            setSelectedCompany(company);
                            setShowDepartments(true);
                        }}
                        onEdit={(company) => {
                            setSelectedCompany(company);
                            setShowModal(true);
                        }}
                        onDelete={deleteCompany}
                    />

                ))}

            </div>

            <CompanyModal
                open={showModal}
                onClose={() => {

                    setShowModal(false);
                    setSelectedCompany(null);

                }}
                company={selectedCompany}
                onSuccess={fetchCompanies}
            />

            <DepartmentModal

                open={showDepartments}

                company={selectedCompany}

                onClose={() => {
                    setShowDepartments(false);
                    setSelectedCompany(null);
                }}

            />

        </div>

    );

}