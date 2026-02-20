"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    School,
    Settings,
    Users,
    Activity,
    Search,
    Bell,
    User,
    Menu,
    X,
    ChevronLeft,
    LogOut
} from "lucide-react";

const PLATFORM_NAV_ITEMS = [
    { label: "Dashboard", href: "/platform", icon: LayoutDashboard },
    { label: "Institutes", href: "/platform/institutes", icon: School },
    { label: "System Status", href: "/platform/status", icon: Activity },
    { label: "Admin Users", href: "/platform/users", icon: Users },
    { label: "Settings", href: "/platform/settings", icon: Settings },
];

export function PlatformLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Clear cookie for all possible domains
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        const hostname = window.location.hostname;
        if (!hostname.includes("localhost")) {
            const domainParts = hostname.split('.');
            if (domainParts.length >= 2) {
                const rootDomain = domainParts.slice(-2).join('.');
                document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${rootDomain}`;
            }
        }
        router.push("/login?target=platform");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-72" : "w-20"
                    } flex flex-col border-r bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out z-20 shadow-xl`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                        O2
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <h1 className="text-xl font-bold tracking-tight text-white line-clamp-1">InstituteOS</h1>
                            <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
                                Platform Admin
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {PLATFORM_NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400 group"
                        title="Log Out"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {sidebarOpen && <span className="text-sm font-medium">Log Out</span>}
                    </button>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
                        {sidebarOpen && <span className="text-xs font-semibold">Collapse Sidebar</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Bar */}
                <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-80 h-10 pl-11 pr-4 rounded-full border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">Super Admin</p>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase">Platform</p>
                            </div>
                            <div className="relative group">
                                <button className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm overflow-hidden hover:bg-slate-200 transition-colors">
                                    <User className="w-6 h-6" />
                                </button>
                                {/* Simple Dropdown on hover or click - for now keeping it simple as a logout button next to it or just adding it */}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                title="Log Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

