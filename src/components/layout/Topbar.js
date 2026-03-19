"use client";

export default function Topbar() {

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      <h2 className="font-semibold text-lg">
        Audit Monitoring System
      </h2>

      <div className="flex items-center gap-4">

        <span className="text-sm text-gray-600">
          Welcome, Auditor
        </span>

        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

      </div>

    </div>
  );
}