import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { TaskService } from "./task.service";
import { TenancyGuard } from "../tenancy/tenancy.guard";
import { TaskStatus, TaskPriority } from "@instituteos/database";

@Controller("tasks")
@UseGuards(TenancyGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body()
    body: {
      title: string;
      description?: string;
      assignedById: string;
      assignedToId: string;
      deadline?: string;
      priority?: TaskPriority;
      parentTaskId?: string;
    },
  ) {
    return this.taskService.create({
      instituteId: req.instituteId!,
      ...body,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    });
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query("status") status?: TaskStatus,
    @Query("assignedToId") assignedToId?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ) {
    return this.taskService.findAllForInstitute(req.instituteId!, {
      status,
      assignedToId,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });
  }

  @Get(":id/subtasks")
  async getSubTasks(@Param("id") id: string) {
    return this.taskService.getSubTasks(id);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: TaskStatus,
  ) {
    return this.taskService.updateStatus(id, status);
  }
}
