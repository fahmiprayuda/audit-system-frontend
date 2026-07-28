"use client";

import useEditFinding from "@/app/findings/hooks/useEditFinding";

import FindingHeader from "@/app/findings/components/FindingHeader";
import FindingInfoCard from "@/app/findings/components/FindingInfoCard";
import SubmitBar from "@/app/findings/components/SubmitBar";
import FindingForm from "@/app/findings/components/FindingForm";

export default function EditFindingPage() {

    const {
        loading,

        project,

        form,
        setForm,

        submitFinding,
    } = useEditFinding();

    return (
        <div className="p-10 bg-gray-100 min-h-screen max-w-5xl mx-auto">

            <FindingHeader
                title="Edit Finding"
                project={project} />

            <FindingForm
                onSubmit={submitFinding}>

                <FindingInfoCard form={form} setForm={setForm} />

                <SubmitBar
                    title="Ready to update finding"
                    summary="Review your changes before saving."
                    buttonText="Update Finding"
                    loading={loading}
                />
            </FindingForm>


        </div >

    );
}