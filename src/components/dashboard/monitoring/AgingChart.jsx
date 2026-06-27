"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function AgingChart({ data }) {

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg">

            <h2 className="text-2xl font-bold mb-2">
                Aging Analysis
            </h2>

            <p className="text-slate-500 mt-1 mb-4">
                Distribution of overdue action plans by age
            </p>

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <BarChart data={data}>
                    <XAxis dataKey="bucket" />
                    <YAxis
                        allowDecimals={false}
                        tickCount={11}
                    />
                    <Tooltip />

                    <Bar
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div
                className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-blue-700">
                    💡 Most overdue action plans are between
                    <b> 0-30 days</b>.
                </p>

            </div>

        </div>
    );
}