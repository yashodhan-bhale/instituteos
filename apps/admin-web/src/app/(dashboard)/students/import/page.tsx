"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function StudentImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function handleImport(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", "format-1");

        try {
            const res = await fetch("/api/v1/import/students", {
                method: "POST",
                // In a real app, the browser adds Multi-part boundary automatically
                body: formData,
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({ success: false, message: "Network error during upload." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bulk Student Import</h1>
                <p className="text-gray-500 mt-2">
                    Upload your Excel catalog to quickly populate your institute&apos;s records.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleImport} className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${file ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                                }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                setFile(e.dataTransfer.files[0]);
                            }}
                        >
                            {file ? (
                                <>
                                    <FileSpreadsheet className="h-12 w-12 text-indigo-600 mb-4" />
                                    <p className="text-lg font-semibold text-indigo-900">{file.name}</p>
                                    <p className="text-sm text-indigo-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="mt-4 text-xs font-bold text-red-500 hover:underline uppercase"
                                    >
                                        Remove File
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">Drop your Excel file here</p>
                                    <p className="text-sm text-gray-400 mt-1">or click to browse from your computer</p>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                            <p className="text-sm text-amber-800">
                                Ensure your Excel file follows <strong>Format-1</strong> (standard catalog).
                                The first row should contain the headers.
                            </p>
                        </div>

                        <button
                            disabled={!file || loading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing Records...
                                </>
                            ) : (
                                "Start Import"
                            )}
                        </button>
                    </form>
                </div>

                {result && (
                    <div className={`p-8 border-t ${result.success ? "bg-emerald-50/30" : "bg-red-50/30"}`}>
                        <div className="flex gap-4">
                            {result.success ? (
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            ) : (
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            )}
                            <div>
                                <h3 className={`font-bold ${result.success ? "text-emerald-900" : "text-red-900"}`}>
                                    {result.success ? "Import Successful" : "Import Failed"}
                                </h3>
                                <p className={`text-sm mt-1 ${result.success ? "text-emerald-700" : "text-red-700"}`}>
                                    {result.message}
                                </p>
                                {result.importedCount > 0 && (
                                    <p className="text-sm font-bold text-emerald-800 mt-2">
                                        Total Records Created: {result.importedCount}
                                    </p>
                                )}
                                {result.errors?.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Row-level Errors:</p>
                                        <div className="max-h-40 overflow-y-auto border border-red-100 rounded-lg bg-white p-3">
                                            {result.errors.map((err: any, i: number) => (
                                                <div key={i} className="text-xs text-red-600 mb-2 last:mb-0">
                                                    <span className="font-bold">Row {err.row}:</span> {err.errors.join(", ")}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
