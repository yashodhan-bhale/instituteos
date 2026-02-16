import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TaskStatus, TaskPriority } from "@instituteos/database";

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: {
        instituteId: string;
        title: string;
        description?: string;
        assignedById: string;
        assignedToId: string;
        deadline?: Date;
        priority?: TaskPriority;
        parentTaskId?: string;
    }) {
        // Generate ltree path
        let path: string;
        if (data.parentTaskId) {
            const parent = await this.prisma.task.findUnique({
                where: { id: data.parentTaskId },
            });
            if (!parent) {
                throw new NotFoundException("Parent task not found");
            }
            // Append new task ID to parent path
            const taskId = this.generatePathSegment();
            path = `${parent.path}.${taskId}`;
        } else {
            path = this.generatePathSegment();
        }

        return this.prisma.task.create({
            data: {
                instituteId: data.instituteId,
                title: data.title,
                description: data.description,
                path,
                assignedById: data.assignedById,
                assignedToId: data.assignedToId,
                deadline: data.deadline,
                priority: data.priority || TaskPriority.MEDIUM,
            },
        });
    }

    async findAllForInstitute(
        instituteId: string,
        options?: {
            status?: TaskStatus;
            assignedToId?: string;
            page?: number;
            pageSize?: number;
        }
    ) {
        const page = options?.page || 1;
        const pageSize = options?.pageSize || 20;

        const where: any = { instituteId };
        if (options?.status) where.status = options.status;
        if (options?.assignedToId) where.assignedToId = options.assignedToId;

        const [data, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: [{ priority: "desc" }, { deadline: "asc" }],
                include: {
                    assignedBy: { select: { firstName: true, lastName: true } },
                    assignedTo: { select: { firstName: true, lastName: true } },
                },
            }),
            this.prisma.task.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async getSubTasks(taskId: string) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task) {
            throw new NotFoundException("Task not found");
        }

        // Find all tasks whose path starts with this task's path (ltree descendant query)
        // Using raw query for ltree operator support
        return this.prisma.$queryRaw`
      SELECT * FROM tasks
      WHERE path <@ ${task.path}::ltree
      AND id != ${taskId}::uuid
      ORDER BY path ASC
    `;
    }

    async updateStatus(taskId: string, status: TaskStatus) {
        const updateData: any = { status };
        if (status === TaskStatus.DONE) {
            updateData.completedAt = new Date();
        }

        return this.prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });
    }

    /**
     * Generate a sanitized path segment for ltree
     * ltree labels can only contain A-Za-z0-9_
     */
    private generatePathSegment(): string {
        return `t_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }
}
