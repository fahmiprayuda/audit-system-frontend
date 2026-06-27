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

            rounded-3xl

            border
            border-slate-200

            shadow-sm
            hover:shadow-lg

            transition-all
            duration-300">
            {/* Decoration */}
            <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-60 ${bgColor}`} />
            {/* Body */}
            <div className="relative p-8">
                <div className="flex justify-between items-start">
                    <span
                        className={`uppercase tracking-[0.2em] font-bold text-sm ${color}`}>
                        {title}
                    </span>
                    <div className={color}>
                        {icon}
                    </div>
                </div>
                <h2 className="mt-8 text-6xl font-bold text-slate-900">
                    {value}
                </h2>
                <h3 className="mt-4 text-3xl font-semibold text-slate-700">
                    {subtitle}
                </h3>
                <p className="mt-4 text-slate-400 leading-7">
                    {description}
                </p>
            </div>

            {/* Footer */}

            <div className="border-t px-8 py-5 bg-slate-50">
                <button className={`font-bold hover:opacity-80 transition ${footerColor}`}>
                    {footer} →
                </button>
            </div>

        </div>
    );
}