"use client";

import useCreateFinding from "@/app/findings/hooks/useCreateFinding";

import FindingHeader from "@/app/findings/components/FindingHeader";
import FindingInfoCard from "@/app/findings/components/FindingInfoCard";
import DepartmentSelector from "@/app/findings/components/DepartmentSelector";
import ActionPlanCard from "@/app/findings/components/ActionPlanCard";
import SubmitBar from "@/app/findings/components/SubmitBar";
import FindingForm from "@/app/findings/components/FindingForm";

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

            <FindingHeader
                title="Create Finding"
                project={project} />

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
                    title="Ready to create finding"
                    summary={`${selectedDepartments.length} department selected • ${selectedDepartments.length} Action Plan will be created`}
                    buttonText="Create Finding"
                    loading={loading}
                />
            </FindingForm>


        </div >

    );
}