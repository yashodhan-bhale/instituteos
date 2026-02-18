"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, School } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [isPlatform, setIsPlatform] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle initial check on mount to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            const target = new URLSearchParams(window.location.search).get("target");

            if (hostname.startsWith("platform.") || target === "platform") {
                setIsPlatform(true);
            }
        }
    }, [searchParams]);

    // Don't render until client-side logic has determined context to prevent hydration mismatch
    if (!isMounted) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl shadow-xl border border-gray-100 min-w-[350px]">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                <p className="mt-4 text-gray-500 text-sm">Detecting workspace...</p>
            </div>
        );
    }

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // Determine Endpoint - Using 127.0.0.1 to avoid localhost DNS/IPv6 issues
            const endpoint = isPlatform
                ? "/api/v1/auth/platform-login"
                : "/api/v1/auth/login";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Success!
            // Set cookie on the root domain to allow cross-subdomain access
            const cookieDomain = window.location.hostname.includes("localhost") ? "" : `; domain=.${window.location.hostname.split('.').slice(-2).join('.')}`;
            document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax${cookieDomain}`;

            // Redirect to appropriate domain
            const hostname = window.location.hostname;
            const protocol = window.location.protocol;
            const port = window.location.port ? `:${window.location.port}` : "";

            if (isPlatform) {
                if (!hostname.startsWith("platform.")) {
                    // Force redirect to platform subdomain
                    const rootDomain = hostname.includes("localhost") ? "localhost" : hostname.split('.').slice(-2).join('.');
                    window.location.href = `${protocol}//platform.${rootDomain}${port}/platform`;
                } else {
                    router.push("/platform");
                }
            } else {
                router.push("/institute");
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
                            placeholder={isPlatform ? "admin@instituteos.com" : "principal@institute.com"}
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
