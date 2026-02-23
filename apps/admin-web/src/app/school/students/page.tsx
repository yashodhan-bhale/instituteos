"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Download, MoreHorizontal, FileText } from "lucide-react";
import Link from "next/link";
import { SlcModal } from "./slc-modal";

interface Student {
    id: string;
    studentName: string;
    grNo: string | null;
    division: string | null;
    gender: string | null;
    birthDate: string | null;
    category: string | null;
    motherName: string | null;
}

function ActionsCell({ student }: { student: Student }) {
    const [open, setOpen] = useState(false);
    const [showSlcModal, setShowSlcModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
                {open && (
                    <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border bg-card p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                        <button
                            onClick={() => {
                                setOpen(false);
                                setShowSlcModal(true);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors text-left"
                        >
                            <FileText className="h-4 w-4 text-primary" />
                            Generate SLC
                        </button>
                    </div>
                )}
            </div>

            {showSlcModal && (
                <SlcModal
                    studentId={student.id}
                    onClose={() => setShowSlcModal(false)}
                />
            )}
        </>
    );
}

const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "studentName",
        header: "Student Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {row.original.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-semibold">{row.original.studentName}</span>
            </div>
        ),
    },
    {
        accessorKey: "grNo",
        header: "GR No",
    },
    {
        accessorKey: "division",
        header: "Division",
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "birthDate",
        header: "Birth Date",
        cell: ({ row }) => row.original.birthDate ? new Date(row.original.birthDate).toLocaleDateString() : "-",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell student={row.original} />,
    }
];

export default function StudentsPage() {
    const { data: students, isLoading, error } = useQuery<Student[]>({
        queryKey: ["students"],
        queryFn: async () => {
            const token = document.cookie.split("; ").find(row => row.startsWith("auth_token="))?.split("=")[1];
            const res = await fetch("/api/v1/students", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch students");
            return res.json();
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Students</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage and track all students in the institute.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-medium hover:bg-muted transition-all">
                        <Download className="h-4 w-4" /> Export
                    </button>
                    <Link
                        href="/students/import"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                    >
                        <Plus className="h-4 w-4" /> Bulk Import
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="h-64 flex items-center justify-center text-red-500">
                        Error loading students: {(error as Error).message}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={students || []}
                        searchPlaceholder="Search students by name, GR No..."
                    />
                )}
            </div>
        </div>
    );
}
