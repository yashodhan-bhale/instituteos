"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function PlatformDashboard() {
    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight leading-tight">
                        Platform <br />
                        <span className="text-indigo-200 uppercase text-xs font-black tracking-[0.3em] bg-white/10 px-3 py-1 rounded-full inline-block mt-4 mb-2">Management Center</span>
                    </h1>
                    <p className="text-lg text-indigo-50 mt-4 leading-relaxed font-medium opacity-90">
                        Oversee your multi-tenant ecosystem. Scalability, security, and institute management at your fingertips.
                    </p>
                    <div className="flex gap-4 mt-10">
                        <Link
                            href="/platform/institutes"
                            className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black shadow-xl shadow-black/10 hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Manage Institutes
                        </Link>
                        <button
                            className="bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500/50 transition-all"
                        >
                            Platform Logs
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    title="Active Institutes"
                    value="2"
                    growth="+100%"
                    color="indigo"
                    description="Successfully provisioned"
                />
                <StatCard
                    title="System Health"
                    value="99.9%"
                    growth="Stable"
                    color="emerald"
                    description="Across all instances"
                />
                <StatCard
                    title="Platform Revenue"
                    value="$1,250"
                    growth="+15%"
                    color="violet"
                    description="Current Billing Cycle"
                />
            </div>

            {/* Activity Table Placeholder */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Events</h2>
                    <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">View Audit Log</button>
                </div>
                <div className="space-y-6">
                    <ActivityItem
                        user="System"
                        action="Database migration completed successfully"
                        time="10 mins ago"
                        tag="Core"
                    />
                    <ActivityItem
                        user="SuperAdmin"
                        action="Updated platform routing configuration"
                        time="1 hour ago"
                        tag="Routing"
                    />
                    <ActivityItem
                        user="Provisioner"
                        action="New instance 'Global Tech' initialized"
                        time="3 hours ago"
                        tag="Instance"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, growth, color, description }: any) {
    const colors: any = {
        indigo: "from-indigo-600 to-blue-600 shadow-indigo-100 ring-indigo-50",
        emerald: "from-emerald-600 to-teal-600 shadow-emerald-100 ring-emerald-50",
        violet: "from-violet-600 to-purple-600 shadow-violet-100 ring-violet-50",
    };
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg`}>
                    <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {growth}
                </span>
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h3>
            <p className="text-4xl font-black text-slate-900 mt-2 mb-1">{value}</p>
            <p className="text-xs font-bold text-slate-400">{description}</p>
        </div>
    );
}

function ActivityItem({ user, action, time, tag }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
            <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {user[0]}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800">
                        <span className="font-bold">{user}</span> {action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter bg-gray-100 text-gray-500 px-2 py-1 rounded">
                {tag}
            </span>
        </div>
    );
}
