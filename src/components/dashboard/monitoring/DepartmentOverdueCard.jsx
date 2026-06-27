export default function DepartmentOverdueCard({
    data = [],
}) {

    const max =
        Math.max(
            ...data.map(d => d.count),
            1
        );

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg">
            <h2 className="text-2xl font-bold">Department Overdue</h2>

            <p className="text-slate-500 text-sm mt-1">Departments with the highest overdue action plans</p>

            <div className="space-y-6 mt-8">
                {data.map((dept) => (
                    <div key={dept.department}>
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                {dept.department}
                            </span>
                            <span className="font-bold text-red-600">
                                {dept.count} AP
                            </span>
                        </div>

                        <div
                            className="mt-2 h-2 rounded-full bg-slate-100">
                            <div
                                style={{
                                    width: `${Math.min(
                                        dept.count * 2,
                                        100
                                    )}%`
                                }}
                                className="h-2 rounded-full bg-red-500" />
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="mt-8 w-full border rounded-xl py-3 hover:bg-slate-50 transition">
                View All Departments →
            </button>
        </div>
    );
}