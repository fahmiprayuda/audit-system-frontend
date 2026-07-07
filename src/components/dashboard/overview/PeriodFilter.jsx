"use client";

import { useState, useRef, useEffect } from "react";
import {
    CalendarDays,
    ChevronDown,
    Check,
} from "lucide-react";

import DatePicker from "react-datepicker";
import { format } from "date-fns";

export default function PeriodFilter({
    period,
    setPeriod,
    onApply,
}) {

    const [startDate, endDate] = period;

    const ref = useRef(null);

    const [open, setOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const YEARS = [];

    for (let y = 2020; y <= currentYear + 14; y++) {
        YEARS.push(y);
    }


    const [activePreset, setActivePreset] =
        useState("year");

    const PERIOD_GROUPS = [
        {
            title: "Quick Filters",
            items: [
                { key: "this_month", label: "This Month" },
                { key: "this_quarter", label: "This Quarter" },
                { key: "this_year", label: "This Year" },
            ],
        },
        {
            title: "Fixed Periods",
            items: [
                { key: "q1", label: "Quarter 1" },
                { key: "q2", label: "Quarter 2" },
                { key: "q3", label: "Quarter 3" },
                { key: "q4", label: "Quarter 4" },
            ],
        },
        {
            title: "Semester",
            items: [
                { key: "s1", label: "Semester 1" },
                { key: "s2", label: "Semester 2" },
            ],
        },
        {
            title: "Year",
            items: [
                { key: "year", label: "Full Year" },
            ],
        },
    ];

    const activeLabel =
        PERIOD_GROUPS
            .flatMap(group => group.items)
            .find(item => item.key === activePreset)
            ?.label || "Custom Range";

    useEffect(() => {

        function handleClickOutside(e) {

            if (
                ref.current &&
                !ref.current.contains(e.target)
            ) {
                setOpen(false);
                setShowCustom(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const applyPreset = (key) => {

        const year = selectedYear;

        let start;
        let end;

        switch (key) {

            case "this_month":
                start = new Date(year, new Date().getMonth(), 1);
                end = new Date(year, new Date().getMonth() + 1, 0);
                break;

            case "this_quarter":
                const q = Math.floor(new Date().getMonth() / 3);
                start = new Date(year, q * 3, 1);
                end = new Date(year, q * 3 + 3, 0);
                break;

            case "this_year":
                start = new Date(year, 0, 1);
                end = new Date(year, 11, 31);
                break;

            case "q1":

                start = new Date(year, 0, 1);
                end = new Date(year, 2, 31);

                break;

            case "q2":

                start = new Date(year, 3, 1);
                end = new Date(year, 5, 30);

                break;

            case "q3":

                start = new Date(year, 6, 1);
                end = new Date(year, 8, 30);

                break;

            case "q4":

                start = new Date(year, 9, 1);
                end = new Date(year, 11, 31);

                break;

            case "s1":

                start = new Date(year, 0, 1);
                end = new Date(year, 5, 30);

                break;

            case "s2":

                start = new Date(year, 6, 1);
                end = new Date(year, 11, 31);

                break;

            case "year":

                start = new Date(year, 0, 1);
                end = new Date(year, 11, 31);

                break;
            default:

                return;

        }

        setActivePreset(key);
        setPeriod([start, end]);

        onApply(
            format(start, "yyyy-MM-dd"),
            format(end, "yyyy-MM-dd")
        );

        setShowCustom(false);
        setOpen(false);

    };

    useEffect(() => {

        if (!activePreset || activePreset === "custom") {
            return;
        }

        applyPreset(activePreset);

    }, [selectedYear]);

    return (

        <div
            className="relative w-[420px]"
            ref={ref}
        >

            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 hover:bg-slate-50"
            >

                <CalendarDays
                    size={18}
                    className="text-slate-500 shrink-0 mr-3"
                />

                <div className="flex-1 text-left">

                    <p className="font-medium">

                        {activeLabel}

                    </p>

                    <p className="text-xs text-slate-500">

                        {startDate && endDate
                            ? `${format(startDate, "dd MMM yyyy")} → ${format(endDate, "dd MMM yyyy")}`
                            : "Select reporting period"}

                    </p>

                </div>

                <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />

            </button>

            {open && (

                <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">

                    <div className="border-t border-slate-100 py-2">

                        <p className="px-4 mb-2 text-xs uppercase tracking-wider text-slate-400">
                            Year
                        </p>

                        <div className="px-4">

                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(Number(e.target.value))
                                }
                                className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-3
                py-2
                bg-white
            "
                            >

                                {YEARS.map(year => (

                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                    {PERIOD_GROUPS.map(group => (

                        <div
                            key={group.title}
                            className={`
    py-2
    ${group.title !== "Current" ? "border-t border-slate-100" : ""}
`}
                        >

                            <p className="px-4 mb-2 text-xs uppercase tracking-wider text-slate-400">
                                {group.title}
                            </p>

                            {group.items.map(item => (

                                <button
                                    key={item.key}
                                    onClick={() =>
                                        applyPreset(item.key)
                                    }
                                    className={`
                    w-full
                    px-4
                    py-3
                    flex
                    items-center
                    justify-between
                    transition

                    ${activePreset === item.key
                                            ? "bg-slate-900 text-white"
                                            : "hover:bg-slate-50"
                                        }
                `}
                                >

                                    <div>

                                        <p className="font-medium">

                                            {item.label}

                                        </p>

                                        {item.desc && (

                                            <p
                                                className={`text-xs

        ${activePreset === item.key
                                                        ? "text-slate-300"
                                                        : "text-slate-400"
                                                    }

    `}
                                            >

                                                {item.desc}

                                            </p>

                                        )}

                                    </div>

                                    {activePreset === item.key && (

                                        <Check size={16} />

                                    )}

                                </button>

                            ))}

                        </div>

                    ))}

                    <button
                        onClick={() => {
                            setActivePreset("custom");
                            setShowCustom(!showCustom);
                        }}
                        className="w-full text-left px-4 py-3 border-t hover:bg-slate-50"
                    >
                        <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            <span>Custom Range</span>
                        </div>
                    </button>

                    {showCustom && (

                        <div className="border-t p-4">

                            <DatePicker
                                inline
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                monthsShown={1}
                                onChange={(dates) => {

                                    setPeriod(dates);

                                    if (
                                        dates[0] &&
                                        dates[1]
                                    ) {

                                        setActivePreset("custom");

                                        onApply(
                                            format(dates[0], "yyyy-MM-dd"),
                                            format(dates[1], "yyyy-MM-dd")
                                        );

                                        setShowCustom(false);
                                        setOpen(false);

                                    }

                                }}
                            />

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}