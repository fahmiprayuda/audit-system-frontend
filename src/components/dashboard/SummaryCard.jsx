export default function SummaryCard({
    title,
    value,
    icon,
    color,
    subtitle,
}) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div
                    className={`
            w-12 h-12
            rounded-2xl
            flex items-center justify-center
            ${color}
          `}
                >
                    {icon}
                </div>

            </div>
        </div>
    );
}