"use client";

interface RoiData {
    totalTimeSavedMinutes: number;
    moneySaved: number;
    lastCalculatedAt: string;
}

// Demo data — will be replaced with API call via TanStack Query
const DEMO_ROI: RoiData = {
    totalTimeSavedMinutes: 4320,
    moneySaved: 156000,
    lastCalculatedAt: new Date().toISOString(),
};

export function RoiDashboard() {
    const roi = DEMO_ROI;
    const hours = Math.floor(roi.totalTimeSavedMinutes / 60);
    const days = Math.floor(hours / 8);

    return (
        <div className="rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">ROI Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                        Real-time value InstituteOS generates for you
                    </p>
                </div>
                <span className="text-xs text-muted-foreground">
                    Updated: {new Date(roi.lastCalculatedAt).toLocaleDateString()}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Time Saved */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-500/20">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5" />
                    <p className="text-sm font-medium text-emerald-100">⏱ Time Saved</p>
                    <p className="text-3xl font-bold mt-2">{hours} hrs</p>
                    <p className="text-xs text-emerald-200 mt-1">
                        ~{days} working days recovered
                    </p>
                </div>

                {/* Money Recovered */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg shadow-blue-500/20">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5" />
                    <p className="text-sm font-medium text-blue-100">💰 Money Recovered</p>
                    <p className="text-3xl font-bold mt-2">
                        ₹{roi.moneySaved.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">Through process automation</p>
                </div>

                {/* Efficiency Score */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shadow-lg shadow-violet-500/20">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5" />
                    <p className="text-sm font-medium text-violet-100">
                        🚀 Efficiency Gain
                    </p>
                    <p className="text-3xl font-bold mt-2">94%</p>
                    <p className="text-xs text-violet-200 mt-1">
                        Compared to manual processes
                    </p>
                </div>
            </div>
        </div>
    );
}
