"use client";

export default function FlagCard({

    title,
    value,
    subtitle,
    description,
    icon,

    color = "text-red-600",
    bgColor = "bg-red-50",

    footer,
    footerColor = "text-blue-600",

}) {

    return (

        <div
            className="
    relative
    overflow-hidden
    bg-white
    rounded-2xl
    border border-slate-200
    shadow-sm
    hover:shadow-md
    transition-all
    duration-300">

            {/* Decoration */}
            <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-50 ${bgColor}`} />

            {/* Body */}
            <div className="relative p-6">
                <div className="flex justify-between items-start">
                    <span
                        className={`uppercase tracking-[0.15em] font-bold text-xs ${color}`}>
                        {title}
                    </span>

                    <div className={color}>
                        {icon}
                    </div>
                </div>

                <h2 className="mt-5 text-4xl font-bold text-slate-900">
                    {value}
                </h2>

                <h3 className="mt-2 text-xl font-semibold text-slate-700">
                    {subtitle}
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-6">
                    {description}
                </p>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-slate-50">
                <button className={`text-sm font-semibold hover:opacity-80 transition ${footerColor}`}>
                    {footer} →
                </button>
            </div>
        </div>
    );
}