import { Test, TestingModule } from "@nestjs/testing";
import { StudentService } from "./student.service";
import { PrismaService } from "../../prisma/prisma.service";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("StudentService", () => {
  let service: StudentService;
  let prisma: PrismaService;

  const mockPrismaService = {
    student: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all students for an institute", async () => {
      const mockStudents = [
        { id: "1", studentName: "John Doe", instituteId: "inst-1" },
        { id: "2", studentName: "Jane Doe", instituteId: "inst-1" },
      ];
      mockPrismaService.student.findMany.mockResolvedValue(mockStudents);

      const result = await service.findAll("inst-1");

      expect(result).toEqual(mockStudents);
      expect(prisma.student.findMany).toHaveBeenCalledWith({
        where: { instituteId: "inst-1" },
        orderBy: { studentName: "asc" },
      });
    });
  });

  describe("findOne", () => {
    it("should return a single student", async () => {
      const mockStudent = {
        id: "1",
        studentName: "John Doe",
        instituteId: "inst-1",
      };
      mockPrismaService.student.findFirst.mockResolvedValue(mockStudent);

      const result = await service.findOne("1", "inst-1");

      expect(result).toEqual(mockStudent);
      expect(prisma.student.findFirst).toHaveBeenCalledWith({
        where: { id: "1", instituteId: "inst-1" },
      });
    });
  });
});
