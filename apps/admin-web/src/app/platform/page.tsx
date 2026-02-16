"use client";

import { useState } from "react";

export default function PlatformDashboard() {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            // In a real app, this would be a protected API call
            const res = await fetch("/api/v1/institutes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setMessage("Institute created successfully!");
                setShowForm(false);
            } else {
                setMessage("Error creating institute.");
            }
        } catch (err) {
            setMessage("Failed to connect to API.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                        Platform Management
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Welcome, Super Admin. Oversee the Oxygen of Institutes.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                    {showForm ? "Cancel" : "Add New Institute"}
                </button>
            </div>

            {showForm && (
                <div className="mb-12 p-8 bg-white rounded-2xl border border-indigo-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Institute</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Institute Name</label>
                            <input
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="e.g. Greenwood High School"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Subdomain</label>
                            <div className="flex items-center">
                                <input
                                    name="domain"
                                    required
                                    className="w-full px-4 py-3 rounded-l-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="greenwood"
                                />
                                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl text-gray-500">
                                    .instituteos.app
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Admin Email</label>
                            <input
                                name="adminEmail"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="admin@greenwood.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Admin Full Name</label>
                            <input
                                name="adminName"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {loading ? "Provisioning..." : "Launch Institute"}
                            </button>
                        </div>
                    </form>
                    {message && (
                        <p className={`mt-4 text-center text-sm font-medium ${message.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Active Institutes" value="12" growth="+2 this month" color="indigo" />
                <StatCard title="Total Students" value="4,850" growth="+12% from Jan" color="emerald" />
                <StatCard title="Platform Revenue" value="$14,200" growth="+8% ARR" color="violet" />
            </div>

            <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    <ActivityItem
                        user="System"
                        action="Successfully backed up database"
                        time="2 hours ago"
                        tag="Database"
                    />
                    <ActivityItem
                        user="SuperAdmin (You)"
                        action="Created 'St. Mary's Academy' institute"
                        time="5 hours ago"
                        tag="Provisioning"
                    />
                    <ActivityItem
                        user="Sales Team"
                        action="Converted 'Oakwood Prep' from Trial to Basic"
                        time="1 day ago"
                        tag="Billing"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, growth, color }: any) {
    const colors: any = {
        indigo: "from-indigo-500 to-blue-500 shadow-indigo-100",
        emerald: "from-emerald-500 to-teal-500 shadow-emerald-100",
        violet: "from-violet-500 to-purple-500 shadow-violet-100",
    };
    return (
        <div className={`p-8 bg-white rounded-2xl border border-gray-100 shadow-xl transition-transform hover:-translate-y-1`}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
            <div className="flex items-end justify-between mt-4">
                <p className="text-4xl font-black text-gray-800">{value}</p>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                    {growth}
                </span>
            </div>
            <div className={`h-1.5 w-full bg-gradient-to-r ${colors[color]} rounded-full mt-6 opacity-30`} />
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
