export default function MonitoringTabs({
    tab,
    setTab,
}) {

    return (

        <div className="mb-8">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                <button
                    onClick={() => setTab("overview")}
                    className={`
                        text-xl
                        px-6
                        py-2
                        rounded-xl
                        transition
                        ${tab === "overview" ? "bg-white shadow font-semibold" : "text-slate-500"}`}>
                    Overview
                </button>

                <button
                    onClick={() => setTab("analytics")}
                    className={`
                        text-xl
                        px-6
                        py-2
                        rounded-xl
                        transition
                        ${tab === "analytics" ? "bg-white shadow font-semibold" : "text-slate-500"}`}>
                    Analytics
                </button>
            </div>
        </div>
    );
}