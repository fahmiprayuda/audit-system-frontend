import AgingChart from "@/components/dashboard/monitoring/AgingChart";
import DepartmentOverdueCard from "@/components/dashboard/monitoring/DepartmentOverdueCard";

export default function Analytics({ data }) {

    const aging = data?.aging || {};
    const departmentOverdue = data?.department_overdue || [];

    const agingChart = [
        {
            bucket: "0-30 Days",
            count: aging["0_30"] || 0,
        },
        {
            bucket: "31-60 Days",
            count: aging["31_60"] || 0,
        },
        {
            bucket: "61-90 Days",
            count: aging["61_90"] || 0,
        },
        {
            bucket: "90+ Days",
            count: aging["90_plus"] || 0,
        },
    ];

    return (

        <>
            <div className="space-y-8">

                {/* Top Row */}

                <div className="grid grid-cols-12 gap-6">

                    <div className="col-span-12 xl:col-span-8">

                        <AgingChart
                            data={agingChart}
                        />

                    </div>

                    <div className="col-span-12 xl:col-span-4">

                        <DepartmentOverdueCard
                            data={departmentOverdue}
                        />

                    </div>

                </div>

            </div>
        </>

    );

}