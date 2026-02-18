import Link from "next/link";
import { School, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/50 backdrop-blur-sm fixed w-full top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <School className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                        InstituteOS
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            Launch Your Digital Campus
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                            Manage your institute with{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Superpowers.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                            The all-in-one operating system for modern institutes.
                            Streamline admissions, track attendance, and manage finances effortlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/login"
                                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                            >
                                Try Demo
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="http://platform.localhost:3000/login"
                                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5 text-gray-400" />
                                Admin Login
                            </Link>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-3xl transform rotate-3 scale-105 blur-2xl opacity-50" />
                        <div className="relative bg-white border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="px-3 py-1 bg-white rounded-md text-[10px] font-medium text-gray-400 flex-1 text-center shadow-sm">
                                    app.instituteos.com
                                </div>
                            </div>
                            <div className="p-8 aspect-[4/3] bg-gray-50 flex items-center justify-center">
                                <div className="text-gray-400 text-sm font-medium">Dashboard Preview</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
