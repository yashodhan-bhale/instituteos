"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Download, Loader2, AlertCircle } from "lucide-react";

interface SlcModalProps {
    studentId: string;
    onClose: () => void;
}

interface SlcFormData {
    studentId: string;
    uidNumber: string;
    fullName: string;
    motherName: string;
    nationality: string;
    motherTongue: string;
    religion: string;
    caste: string;
    subCaste: string;
    birthPlace: string;
    dateOfBirth: string;
    dateOfBirthInWords: string;
    previousSchool: string;
    dateOfAdmission: string;
    admissionClass: string;
    educationalProgress: string;
    behaviour: string;
    dateOfLeaving: string;
    lastClass: string;
    periodOfLearning: string;
    reasonForLeaving: string;
    remark: string;
}

const FIELD_LABELS: Record<keyof SlcFormData, string> = {
    studentId: "Student ID",
    uidNumber: "UID Number",
    fullName: "Full Name of Student",
    motherName: "Mother's Name",
    nationality: "Nationality",
    motherTongue: "Mother Tongue",
    religion: "Religion",
    caste: "Caste",
    subCaste: "Sub-Caste",
    birthPlace: "Birth Place",
    dateOfBirth: "Date of Birth (in digits)",
    dateOfBirthInWords: "Date of Birth (in words)",
    previousSchool: "Previous School/College and Class",
    dateOfAdmission: "Date of Admission",
    admissionClass: "Admission Class (Standard)",
    educationalProgress: "Educational Progress",
    behaviour: "Behaviour",
    dateOfLeaving: "Date of Leaving this School/College",
    lastClass: "Last Class (Standard) and Period of Learning",
    periodOfLearning: "Period of Learning in Last Class",
    reasonForLeaving: "Reason for Leaving the School/College",
    remark: "Remark",
};

function numberToWords(num: number): string {
    if (num === 0) return "zero";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? "-" + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "");
    if (num < 10000) return numberToWords(Math.floor(num / 1000)) + " thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
    return String(num);
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function dateToWords(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const day = numberToWords(d.getDate());
    const month = MONTHS[d.getMonth()];
    const year = numberToWords(d.getFullYear());
    return `${day} ${month} ${year}`;
}

function formatDateDigits(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
}

export function SlcModal({ studentId, onClose }: SlcModalProps) {
    const [formData, setFormData] = useState<SlcFormData>({
        studentId: "",
        uidNumber: "",
        fullName: "",
        motherName: "",
        nationality: "",
        motherTongue: "",
        religion: "",
        caste: "",
        subCaste: "",
        birthPlace: "",
        dateOfBirth: "",
        dateOfBirthInWords: "",
        previousSchool: "",
        dateOfAdmission: "",
        admissionClass: "",
        educationalProgress: "",
        behaviour: "",
        dateOfLeaving: "",
        lastClass: "",
        periodOfLearning: "",
        reasonForLeaving: "",
        remark: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [missingFields, setMissingFields] = useState<Set<string>>(new Set());

    const fetchStudentData = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = document.cookie.split("; ").find(row => row.startsWith("auth_token="))?.split("=")[1];
            const res = await fetch(`/api/v1/students/${studentId}/slc-data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch student data");
            const data = await res.json();

            const student = data.student;
            const birthDateDigits = student.birthDate ? formatDateDigits(student.birthDate) : "";
            const birthDateWords = student.birthDate ? dateToWords(student.birthDate) : "";

            const prefilled: SlcFormData = {
                studentId: student.studentIdTag || student.grNo || "",
                uidNumber: student.uidNumber || "",
                fullName: student.studentName || "",
                motherName: student.motherName || "",
                nationality: student.nationality || "",
                motherTongue: student.motherTongue || "",
                religion: student.religion || "",
                caste: student.caste || "",
                subCaste: student.subCaste || "",
                birthPlace: student.birthPlace || "",
                dateOfBirth: birthDateDigits,
                dateOfBirthInWords: birthDateWords,
                previousSchool: "",
                dateOfAdmission: "",
                admissionClass: "",
                educationalProgress: "",
                behaviour: "",
                dateOfLeaving: "",
                lastClass: "",
                periodOfLearning: "",
                reasonForLeaving: "",
                remark: "",
            };

            // Track which fields are missing from the DB
            const missing = new Set<string>();
            for (const [key, value] of Object.entries(prefilled)) {
                if (!value) missing.add(key);
            }

            setFormData(prefilled);
            setMissingFields(missing);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchStudentData();
    }, [studentId, fetchStudentData]);

    function handleChange(key: keyof SlcFormData, value: string) {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    async function handleGenerate() {
        try {
            setIsGenerating(true);
            const token = document.cookie.split("; ").find(row => row.startsWith("auth_token="))?.split("=")[1];
            const res = await fetch(`/api/v1/students/${studentId}/slc`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to generate PDF");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `SLC-${formData.fullName.replace(/\s+/g, "_") || "certificate"}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    }

    const missingCount = Object.entries(formData).filter(([key, val]) => missingFields.has(key) && !val).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">School Leaving Certificate</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Review and complete information before generating the PDF.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Missing fields warning */}
                {missingCount > 0 && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                {missingCount} field{missingCount > 1 ? "s" : ""} missing from database
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                                Highlighted fields below need to be filled in manually.
                            </p>
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="h-48 flex items-center justify-center text-red-500">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Object.keys(FIELD_LABELS) as Array<keyof SlcFormData>).map((key) => {
                                const isMissing = missingFields.has(key) && !formData[key];
                                const isLong = [
                                    "previousSchool", "educationalProgress", "reasonForLeaving", "remark"
                                ].includes(key);

                                return (
                                    <div
                                        key={key}
                                        className={`${isLong ? "md:col-span-2" : ""}`}
                                    >
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                            {FIELD_LABELS[key]}
                                            {isMissing && (
                                                <span className="ml-1.5 text-amber-600 dark:text-amber-400 normal-case tracking-normal font-medium">
                                                    (missing)
                                                </span>
                                            )}
                                        </label>
                                        {isLong ? (
                                            <textarea
                                                value={formData[key]}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                                rows={2}
                                                className={`w-full rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none ${isMissing
                                                    ? "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
                                                    : "border-border"
                                                    }`}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData[key]}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                                className={`w-full rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all ${isMissing
                                                    ? "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
                                                    : "border-border"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || isLoading}
                        className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4" />
                                Generate PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
