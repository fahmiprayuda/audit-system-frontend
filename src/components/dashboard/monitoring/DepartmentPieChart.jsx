"use client";

import { CHART_COLORS } from "@/constants/chartColors";

import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

export default function DepartmentPieChart({ data = [] }) {

    const chartData = data.map((item, index) => ({
        ...item,
        fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    const total = data.reduce(
        (sum, item) => sum + item.total,
        0
    );

    if (!chartData.length) {
        return (
            <div className="w-full h-72 flex items-center justify-center border">
                <p className="text-slate-400 text-sm">
                    No data available
                </p>
            </div>

        );
    }

    return (

        <div className="w-full h-72 border">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <PieChart>

                    <Pie
                        data={chartData}
                        dataKey="total"
                        nameKey="department"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        cornerRadius={8}
                        label={false}
                    />

                    <text
                        x="50%"
                        y="47%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-slate-900 text-4xl font-bold"
                    >
                        {total}
                    </text>

                    <text
                        x="50%"
                        y="58%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-slate-400 text-sm"
                    >
                        Action Plans
                    </text>

                    <Tooltip />

                </PieChart>



            </ResponsiveContainer>

        </div>

    );

}