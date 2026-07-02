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

        <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex justify-between">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconColor}`}>
                    {icon}
                </div>

                <span className={`h-fit px-3 py-1 rounded-lg text-xs font-bold ${badgeColor}`}>
                    {badge}
                </span>
            </div>

            <h3 className="mt-5 text-sm text-slate-500 uppercase tracking-wide font-semibold">
                {title}
            </h3>

            <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-bold">
                    {value}
                </span>

                <div className={`w-2.5 h-2.5 rounded-full mb-3 ${dotColor}`} />
            </div>

            <p className="mt-4 text-sm text-slate-400">
                {description}
            </p>
        </div>
    );
}