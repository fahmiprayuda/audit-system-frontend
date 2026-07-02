"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ActionPlanMenu({
    onHistory,
}) {

    const [open, setOpen] = useState(false);

    const ref = useRef(null);

    useEffect(() => {

        const handleClick = (e) => {

            if (
                ref.current &&
                !ref.current.contains(e.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClick
            );

    }, []);

    return (
        <div
            className="relative"
            ref={ref}
            onClick={(e) => e.stopPropagation()}
        >

            <button
                onClick={(e) => {

                    e.stopPropagation();

                    setOpen(!open);

                }}
                className="p-2 rounded-lg hover:bg-slate-100"
            >
                <MoreVertical size={18} />
            </button>

            {open && (

                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-xl z-50">

                    <button
                        onClick={(e) => {

                            e.stopPropagation();

                            setOpen(false);

                            onHistory();

                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50"
                    >
                        🕒 Extension History
                    </button>

                </div>

            )}

        </div>
    );

}