import Link from "next/link";
import { RoiDashboard } from "@/components/dashboard/roi-dashboard";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    A K National High School, Khamgaon &rarr; Manage your school, track attendance, expense, and net worth.
                </p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                <StatCard
                    title="Total Student"
                    value="597"
                    change="100%"
                    trend="+597 This Month"
                    changeType="positive"
                    icon="👨‍🎓" // In real app, use SVG icons like lucide-react
                    color="orange"
                />
                <StatCard
                    title="Total Teachers"
                    value="42"
                    change="0%"
                    trend="Stable"
                    changeType="positive"
                    icon="👩‍🏫"
                    color="blue"
                />
                <StatCard
                    title="Total Parents"
                    value="580"
                    change="0%"
                    trend="New Enrollment"
                    changeType="positive"
                    icon="👨‍👩‍👧‍👦"
                    color="purple"
                />
            </div>

            {/* Second Row Stats (if needed for 4th card like Revenue or Attendance) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Revenue"
                    value="$50,000"
                    change="8%"
                    trend="+$1k This Month"
                    changeType="positive"
                    icon="💰"
                    color="emerald"
                />
                {/* Placeholder for Attendance card style from image which is different */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
                    <h3 className="font-semibold text-foreground mb-4">Student Attendance</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present</span>
                            <span className="font-bold">87%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Statistic (ROI Dashboard) */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">Revenue Statistic</h3>
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">● Total Fee: $500</span>
                        <span className="flex items-center gap-1 text-orange-500 font-medium">● Collected Fee: $300</span>
                    </div>
                </div>
                {/* Reusing existing component but assuming it fits the style */}
                <RoiDashboard />
            </div>

            {/* Bottom Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recently Imported Students */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Recently Imported Students</h3>
                        <Link href="/students" className="text-xs text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Anjili Ramrao Deshmukh", grNo: "44458", date: "Today" },
                            { name: "Dikshant Kailas Telang", grNo: "42306", date: "Today" },
                            { name: "Prachi Mangesh Modkar", grNo: "42818", date: "Today" },
                            { name: "Arushi Shankar Shinde", grNo: "41976", date: "Today" },
                            { name: "Darshana Ashok Ugale", grNo: "41975", date: "Today" }
                        ].map((student, i) => (
                            <div key={i} className="flex gap-4 items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 text-sm font-bold">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold">{student.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        GR No: {student.grNo}
                                    </p>
                                </div>
                                <div className="text-[10px] text-muted-foreground">{student.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                        {[
                            { time: "09:00 - 09:45 AM", title: "Marketing Strategy Kickoff", lead: "Robert Fox" },
                            { time: "11:15 - 12:00 AM", title: "Product Design Brainstorm", lead: "Leslie Alexander" }
                        ].map((event, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                <div>
                                    <p className="text-xs font-semibold text-primary">{event.time}</p>
                                    <p className="text-sm font-bold mt-1">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">Lead by {event.lead}</p>
                                </div>
                                <button className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground hover:bg-background border border-border transition-all">
                                    View
                                </button>
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
    trend,
    changeType,
    icon,
    color = "emerald",
}: {
    title: string;
    value: string;
    change: string;
    trend: string;
    changeType: "positive" | "negative";
    icon: string;
    color?: "emerald" | "orange" | "purple" | "blue";
}) {
    // Map colors to Tailwind classes
    const colorClasses = {
        emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
        purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]} transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span
                            className={`text-xs font-bold px-1.5 py-0.5 rounded ${changeType === "positive"
                                ? "bg-emerald-100/50 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-100/50 text-red-600 dark:text-red-400"
                                }`}
                        >
                            {changeType === "positive" ? "▲" : "▼"} {change}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{trend}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
