"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Students", href: "/students", icon: "👨‍🎓" },
    { label: "Staff", href: "/staff", icon: "👩‍🏫" },
    { label: "Tasks", href: "/tasks", icon: "📋" },
    { label: "Attendance", href: "/attendance", icon: "✅" },
    { label: "Finance", href: "/finance", icon: "💰" },
    { label: "Reports", href: "/reports", icon: "📈" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-[var(--sidebar-width)]" : "w-20"
                    } flex flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25">
                        IO
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <h1 className="text-lg font-bold tracking-tight">InstituteOS</h1>
                            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                                Oxygen
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t px-4 py-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                    >
                        <span className="text-lg">{sidebarOpen ? "◀" : "▶"}</span>
                        {sidebarOpen && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 border-b flex items-center justify-between px-8 bg-card/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-72 h-9 pl-9 pr-4 rounded-lg border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                🔍
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-lg">🔔</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">{children}</div>
            </main>
        </div>
    );
}
