"use client";

export default function FindingForm({ children, onSubmit }) {

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
        >
            {children}
        </form>

    );

}