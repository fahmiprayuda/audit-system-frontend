import ActionPlanMonitoring from "@/app/dashboard/action-plan-monitoring/ActionPlanMonitoring";

export const metadata = {
    title: "Action Plan Dashboard",
    description: "Action Plan Monitoring Page for the Audit System Application - Internal Audit Department",
};

export default function Page() {
    return (
        <ActionPlanMonitoring />
    );
}