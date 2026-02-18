import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("students")
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll(@Req() req: any) {
    const instituteId = req.instituteId;
    if (!instituteId) {
      // Fallback for development if tenancy middleware isn't active or for debugging
      return this.studentService.findAll(
        "33e3c153-3f49-4e08-8cf6-8dc280587fe0",
      );
    }
    return this.studentService.findAll(instituteId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    const instituteId =
      req.instituteId || "33e3c153-3f49-4e08-8cf6-8dc280587fe0";
    const student = await this.studentService.findOne(id, instituteId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }
}
