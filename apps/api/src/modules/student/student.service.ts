import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(instituteId: string) {
    return this.prisma.student.findMany({
      where: { instituteId },
      orderBy: { studentName: "asc" },
    });
  }

  async findOne(id: string, instituteId: string) {
    return this.prisma.student.findFirst({
      where: { id, instituteId },
    });
  }
}
