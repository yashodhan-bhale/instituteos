"use client";

import { useState, useEffect } from "react";
import {
    School,
    Plus,
    Search,
    MoreVertical,
    Settings,
    Trash2,
    ExternalLink,
    Loader2,
    Calendar,
    User,
    Globe
} from "lucide-react";

interface Institute {
    id: string;
    name: string;
    domain: string;
    adminEmail: string;
    adminName: string;
    createdAt: string;
    status: string;
}

export default function InstitutesPage() {
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInstitutes = async () => {
        try {
            setLoading(true);
            const token = document.cookie.split("; ").find(row => row.startsWith("auth_token="))?.split("=")[1];

            const res = await fetch("/api/v1/institutes", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to fetch institutes");

            const data = await res.json();
            setInstitutes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const filteredInstitutes = institutes.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institutes</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and monitor all active educational platforms.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchInstitutes()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                        title="Refresh list"
                    >
                        <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span>Launch New</span>
                    </button>
                </div>
            </div>

            {/* Filter/Search Bar */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, domain or admin email..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Status: All</button>
                    <button className="px-4 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg">Sort: Newest</button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold">Retrieving institute records...</p>
                </div>
            ) : error ? (
                <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
                    <p className="text-red-600 font-bold mb-4">{error}</p>
                    <button
                        onClick={() => fetchInstitutes()}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredInstitutes.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <School className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No institutes found</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Try adjusting your search filters or add a new institute to get started.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Institute Details</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Subdomain</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Admin</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Created</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredInstitutes.map((inst) => (
                                    <tr key={inst.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-inner">
                                                    <School className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{inst.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">ID: {inst.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden md:table-cell">
                                            <div className="flex items-center gap-2 py-1 px-3 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold w-fit">
                                                <Globe className="w-3.5 h-3.5 opacity-50" />
                                                {inst.domain}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 hidden lg:table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{inst.adminName}</p>
                                                    <p className="text-xs text-slate-400">{inst.adminEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-black uppercase bg-emerald-50 text-emerald-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <Calendar className="w-4 h-4 opacity-40" />
                                                {new Date(inst.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                                <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">Showing {filteredInstitutes.length} of {institutes.length} records</p>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
                            <button disabled className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
