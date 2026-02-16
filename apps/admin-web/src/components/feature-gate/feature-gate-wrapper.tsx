"use client";

import React from "react";

interface FeatureGateProps {
    moduleName: string;
    activeModules: string[];
    isTrial: boolean;
    isExpired: boolean;
    children: React.ReactNode;
}

/**
 * FeatureGateWrapper - HOC that controls access to features based on subscription
 *
 * - If module is active: show children normally
 * - If in trial: show with "Trial: [Module Name]" badge
 * - If expired: show "Upgrade to Unlock" overlay
 */
export function FeatureGateWrapper({
    moduleName,
    activeModules,
    isTrial,
    isExpired,
    children,
}: FeatureGateProps) {
    const isModuleActive = activeModules.includes(moduleName);

    // Module not in subscription and not in trial
    if (!isModuleActive && !isTrial) {
        return (
            <div className="relative rounded-xl border bg-card overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-background/80 z-10 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <div className="text-center px-8">
                        <h3 className="text-lg font-semibold">
                            {moduleName} Module Locked
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upgrade your subscription to unlock this module.
                        </p>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200">
                        Upgrade to Unlock
                    </button>
                </div>
                <div className="opacity-20 pointer-events-none">{children}</div>
            </div>
        );
    }

    // Trial expired
    if (isExpired) {
        return (
            <div className="relative rounded-xl border bg-card overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-background/80 z-10 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="text-3xl">⏰</span>
                    </div>
                    <div className="text-center px-8">
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                            Trial Expired
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your 60-day trial has ended. Subscribe to continue using{" "}
                            {moduleName}.
                        </p>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200">
                        Subscribe Now
                    </button>
                </div>
                <div className="opacity-20 pointer-events-none">{children}</div>
            </div>
        );
    }

    // Active with trial badge
    return (
        <div className="relative">
            {isTrial && (
                <div className="absolute -top-2 -right-2 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25 animate-pulse">
                        ✨ Trial: {moduleName}
                    </span>
                </div>
            )}
            {children}
        </div>
    );
}
