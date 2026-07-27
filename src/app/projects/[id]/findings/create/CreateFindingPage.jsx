"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCreateFinding from "@/app/projects/[id]/findings/create/hooks/useCreateFinding";

import FindingHeader from "@/app/projects/[id]/findings/create/components/FindingHeader";
import FindingInfoCard from "@/app/projects/[id]/findings/create/components/FindingInfoCard";
import DepartmentSelector from "@/app/projects/[id]/findings/create/components/DepartmentSelector";
import ActionPlanCard from "@/app/projects/[id]/findings/create/components/ActionPlanCard";
import SubmitBar from "@/app/projects/[id]/findings/create/components/SubmitBar";
import FindingForm from "@/app/projects/[id]/findings/create/components/FindingForm";

export default function CreateFindingPage() {

    const {
        loading,

        project,
        departments,

        form,
        setForm,

        selectedDepartments,

        actionPlans,

        toggleDepartment,
        handleAPChange,
        submitFinding,
    } = useCreateFinding();

    return (
        <div className="p-10 bg-gray-100 min-h-screen max-w-5xl mx-auto">

            <FindingHeader project={project} />

            <FindingForm
                onSubmit={submitFinding}>

                <FindingInfoCard form={form} setForm={setForm} />

                <DepartmentSelector
                    departments={departments}
                    selectedDepartments={selectedDepartments}
                    toggleDepartment={toggleDepartment}
                />

                <ActionPlanCard
                    departments={departments}
                    selectedDepartments={selectedDepartments}
                    actionPlans={actionPlans}
                    handleAPChange={handleAPChange}
                />

                <SubmitBar
                    loading={loading}
                    selectedDepartments={selectedDepartments}
                />
            </FindingForm>


        </div >

    );
}