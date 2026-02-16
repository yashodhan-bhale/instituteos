import { z } from "zod";

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export const InstituteTier = z.enum(["TRIAL", "BASIC", "PREMIUM"]);
export type InstituteTier = z.infer<typeof InstituteTier>;

export const UserRole = z.enum([
    "SUPER_ADMIN",
    "INSTITUTE_ADMIN",
    "PRINCIPAL",
    "OFFICE_STAFF",
    "TEACHER",
]);
export type UserRole = z.infer<typeof UserRole>;

export const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "DONE", "OVERDUE"]);
export type TaskStatus = z.infer<typeof TaskStatus>;

export const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type TaskPriority = z.infer<typeof TaskPriority>;

// ──────────────────────────────────────────────
// Institute
// ──────────────────────────────────────────────

export const InstituteSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(255),
    domain: z.string().nullable().optional(),
    tier: InstituteTier,
    trialStartDate: z.coerce.date(),
    config: z.record(z.unknown()).default({}),
});
export type Institute = z.infer<typeof InstituteSchema>;

export const CreateInstituteSchema = InstituteSchema.omit({
    id: true,
    trialStartDate: true,
});
export type CreateInstitute = z.infer<typeof CreateInstituteSchema>;

// ──────────────────────────────────────────────
// User
// ──────────────────────────────────────────────

export const UserSchema = z.object({
    id: z.string().uuid(),
    instituteId: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    isActive: z.boolean().default(true),
});
export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    instituteId: z.string().uuid().optional(),
});
export type LoginPayload = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    instituteId: z.string().uuid(),
    role: UserRole,
});
export type RegisterPayload = z.infer<typeof RegisterSchema>;

// ──────────────────────────────────────────────
// Subscription
// ──────────────────────────────────────────────

export const AVAILABLE_MODULES = [
    "ACADEMIC",
    "FINANCE",
    "TASKS",
    "ATTENDANCE",
    "COMMUNICATION",
    "HR",
] as const;

export const ModuleKey = z.enum(AVAILABLE_MODULES);
export type ModuleKey = z.infer<typeof ModuleKey>;

export const SubscriptionSchema = z.object({
    id: z.string().uuid(),
    instituteId: z.string().uuid(),
    activeModules: z.array(z.string()),
    studentCount: z.number().int().min(0),
    annualFee: z.number().min(0),
    isPaid: z.boolean(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

// ──────────────────────────────────────────────
// Task
// ──────────────────────────────────────────────

export const TaskSchema = z.object({
    id: z.string().uuid(),
    instituteId: z.string().uuid(),
    title: z.string().min(1).max(500),
    description: z.string().nullable().optional(),
    path: z.string(),
    assignedById: z.string().uuid(),
    assignedToId: z.string().uuid(),
    deadline: z.coerce.date().nullable().optional(),
    status: TaskStatus,
    priority: TaskPriority,
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = TaskSchema.omit({
    id: true,
    instituteId: true,
    status: true,
}).extend({
    status: TaskStatus.optional(),
});
export type CreateTask = z.infer<typeof CreateTaskSchema>;

// ──────────────────────────────────────────────
// Pricing
// ──────────────────────────────────────────────

export const MODULE_FEES: Record<string, number> = {
    ACADEMIC: 500,
    FINANCE: 400,
    TASKS: 200,
    ATTENDANCE: 300,
    COMMUNICATION: 250,
    HR: 350,
};

export const PRICING_CONFIG = {
    baseFee: 1000,
    perStudentFee: 10,
    minAnnualFee: 2000,
    maxAnnualFee: 20000,
} as const;

export interface PricingCalculation {
    baseFee: number;
    moduleFees: number;
    studentFee: number;
    rawTotal: number;
    annualFee: number;
}

// ──────────────────────────────────────────────
// Telemetry
// ──────────────────────────────────────────────

export const FeatureUsageSchema = z.object({
    moduleKey: z.string(),
    featureKey: z.string(),
});
export type FeatureUsage = z.infer<typeof FeatureUsageSchema>;

export const RoiStatsSchema = z.object({
    totalTimeSavedMinutes: z.number().int().min(0),
    moneySaved: z.number().min(0),
    lastCalculatedAt: z.coerce.date(),
});
export type RoiStats = z.infer<typeof RoiStatsSchema>;

// ──────────────────────────────────────────────
// API Response Types
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface PaginationQuery {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
}
