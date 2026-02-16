"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, School } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPlatform, setIsPlatform] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Subdomain / Context Detection
    useEffect(() => {
        // 1. Check URL first
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname.startsWith("platform.")) {
                setIsPlatform(true);
            }
        }

        // 2. Check query param (force override from middleware)
        if (searchParams.get("target") === "platform") {
            setIsPlatform(true);
        }
    }, [searchParams]);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const instituteId = formData.get("instituteId") as string;

        try {
            // Determine Endpoint
            const endpoint = isPlatform
                ? "http://localhost:3001/api/v1/auth/platform-login"
                : "http://localhost:3001/api/v1/auth/login";

            const body: any = { email, password };
            if (!isPlatform && instituteId) {
                // If we are on the main domain but logging into an institute, passing instituteId might be needed
                // But optimally, the subdomain handles it. For now, let's just send what we have.
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Success!
            // In a real app, we'd set a secure cookie here via a Server Action or Route Handler proxy.
            // For this MVP, we'll set it client-side to satisfy the middleware.
            document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;

            // Redirect
            if (isPlatform) {
                router.push("/platform");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className={`p-8 text-center ${isPlatform ? "bg-slate-900" : "bg-indigo-600"}`}>
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
                    {isPlatform ? (
                        <ShieldCheck className="h-8 w-8 text-white" />
                    ) : (
                        <School className="h-8 w-8 text-white" />
                    )}
                </div>
                <h1 className="text-2xl font-bold text-white">
                    {isPlatform ? "Platform Admin" : "Institute Login"}
                </h1>
                <p className="text-indigo-100 mt-2 text-sm">
                    {isPlatform
                        ? "Secure access for InstituteOS staff only."
                        : "Welcome back to your digital campus."}
                </p>
            </div>

            {/* Form */}
            <div className="p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder={isPlatform ? "admin@instituteos.com" : "principal@school.com"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className={`w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 ${isPlatform
                            ? "bg-slate-900 shadow-slate-200"
                            : "bg-indigo-600 shadow-indigo-200"
                            }`}
                    >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>

            {/* Footer Toggle (For Dev/Testing) */}
            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <button
                    onClick={() => setIsPlatform(!isPlatform)}
                    className="text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    Switch to {isPlatform ? "Institute" : "Platform"} Login (Dev Only)
                </button>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Suspense fallback={
                <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                    <p className="mt-4 text-gray-500">Loading authentication...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
