export default function PlanStatusCard({

    title,
    value,
    badge,
    badgeColor,
    icon,
    iconColor,
    dotColor,
    description,

}) {

    return (

        <div className="relative bg-white rounded-3xl border border-slate-200 p-10 shadow-sm hover:shadow-lg transition">
            <div className="flex justify-between">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${iconColor}`}>
                    {icon}
                </div>
                <span className={`h-fit px-4 py-2 rounded-xl text-sm font-bold ${badgeColor}`}>
                    {badge}
                </span>
            </div>

            <h3 className="mt-8 text-slate-500 uppercase tracking-wide font-semibold">
                {title}
            </h3>

            <div className="flex items-end gap-3 mt-3">
                <span className="text-6xl font-bold">
                    {value}
                </span>

                <div className={`w-3 h-3 rounded-full mb-4 ${dotColor}`} />
            </div>

            <p className="mt-6 text-slate-400">
                {description}
            </p>
        </div>
    );
}