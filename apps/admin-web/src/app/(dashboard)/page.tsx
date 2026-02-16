import { RoiDashboard } from "@/components/dashboard/roi-dashboard";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back to InstituteOS — your institute at a glance.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value="1,247"
                    change="+12%"
                    changeType="positive"
                    icon="👨‍🎓"
                />
                <StatCard
                    title="Staff Members"
                    value="86"
                    change="+3"
                    changeType="positive"
                    icon="👩‍🏫"
                />
                <StatCard
                    title="Tasks Pending"
                    value="23"
                    change="-5"
                    changeType="negative"
                    icon="📋"
                />
                <StatCard
                    title="Attendance Today"
                    value="94.2%"
                    change="+1.3%"
                    changeType="positive"
                    icon="✅"
                />
            </div>

            {/* ROI Dashboard Widget */}
            <RoiDashboard />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
                    <div className="space-y-3">
                        {[
                            { title: "Update fee structure", status: "IN_PROGRESS", priority: "HIGH" },
                            { title: "Prepare exam schedule", status: "PENDING", priority: "URGENT" },
                            { title: "Staff meeting minutes", status: "DONE", priority: "MEDIUM" },
                        ].map((task, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <span className="font-medium">{task.title}</span>
                                <div className="flex gap-2">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${task.priority === "URGENT"
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                : task.priority === "HIGH"
                                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            }`}
                                    >
                                        {task.priority}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${task.status === "DONE"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : task.status === "IN_PROGRESS"
                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                            }`}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Smart Signals</h3>
                    <div className="space-y-3">
                        {[
                            {
                                type: "warning",
                                message: "Attendance dropped 18% below average for Class 8-B",
                                time: "2 hours ago",
                            },
                            {
                                type: "alert",
                                message: "3 tasks due within 24 hours",
                                time: "30 min ago",
                            },
                            {
                                type: "info",
                                message: "Fee collection 92% complete for this month",
                                time: "1 hour ago",
                            },
                        ].map((signal, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg border-l-4 ${signal.type === "warning"
                                        ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                                        : signal.type === "alert"
                                            ? "border-l-red-500 bg-red-50 dark:bg-red-900/10"
                                            : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10"
                                    }`}
                            >
                                <p className="text-sm font-medium">{signal.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {signal.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    change,
    changeType,
    icon,
}: {
    title: string;
    value: string;
    change: string;
    changeType: "positive" | "negative";
    icon: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                    <p
                        className={`text-xs mt-1 font-medium ${changeType === "positive"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {change} from last month
                    </p>
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    );
}
