"use client";

import Skeleton from "@/components/ui/Skeleton";

export default function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/60 p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Link Skeleton */}
        <div className="w-32 h-6 bg-slate-200/70 rounded-lg" />

        {/* Header Skeleton */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-24 h-6 bg-slate-200 rounded-lg" />
                <div className="w-20 h-6 bg-slate-200/60 rounded-lg" />
              </div>
              <div className="w-72 md:w-96 h-8 bg-slate-200 rounded-xl" />
              <div className="flex items-center gap-4 pt-1">
                <div className="w-28 h-4 bg-slate-200/70 rounded" />
                <div className="w-28 h-4 bg-slate-200/70 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-32 h-10 bg-slate-200 rounded-xl" />
              <div className="w-28 h-10 bg-slate-200 rounded-xl" />
              <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* KPI Summary Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-20 h-3.5 bg-slate-200/80 rounded" />
              <div className="w-12 h-7 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Table Skeleton Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="w-48 h-6 bg-slate-200 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="h-12 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
