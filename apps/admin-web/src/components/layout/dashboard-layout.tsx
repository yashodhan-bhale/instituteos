"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Updated Nav Items based on typical dashboard needs
const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "School", href: "/school", icon: "🏫" },
    { label: "Student", href: "/students", icon: "👨‍🎓" },
    { label: "Teacher", href: "/staff", icon: "👩‍🏫" },
    { label: "Parent", href: "/parents", icon: "👨‍👩‍👧‍👦" },
    { label: "LMS", href: "/lms", icon: "📚" },
    { label: "Fees Collection", href: "/finance", icon: "💰" },
    { label: "Attendance", href: "/attendance", icon: "✅" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-[var(--sidebar-width)]" : "w-20"
                    } flex flex-col border-r bg-card transition-all duration-300 ease-in-out z-20`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20">
                        AK
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <h1 className="text-xl font-bold tracking-tight text-foreground line-clamp-1">AK National</h1>
                            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                                High School
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="ml-auto text-muted-foreground hover:text-foreground lg:hidden"
                    >
                        ◀
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <span className={`text-lg transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Bar */}
                <header className="h-20 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hidden lg:block"
                        >
                            <span className="text-xl">☰</span>
                        </button>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 h-10 pl-10 pr-4 rounded-full border-none bg-white shadow-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all group-hover:shadow-md"
                            />
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                🔍
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-4 pr-1 shadow-sm border border-border/50">
                            <div className="text-right mr-2 hidden sm:block">
                                <p className="text-sm font-semibold">Jone Copper</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                                JC
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">{children}</div>
            </main>
        </div>
    );
}
