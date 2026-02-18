import { Test, TestingModule } from "@nestjs/testing";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("StudentController", () => {
  let controller: StudentController;
  let service: StudentService;

  const mockStudentService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return students for the current institute", async () => {
      const mockStudents = [{ id: "1", studentName: "John Doe" }];
      mockStudentService.findAll.mockResolvedValue(mockStudents);

      const req = { instituteId: "inst-1" };
      const result = await controller.findAll(req);

      expect(result).toEqual(mockStudents);
      expect(service.findAll).toHaveBeenCalledWith("inst-1");
    });

    it("should use fallback institute id if not provided (dev mode)", async () => {
      const mockStudents = [{ id: "1", studentName: "John Doe" }];
      mockStudentService.findAll.mockResolvedValue(mockStudents);

      const req = {};
      const result = await controller.findAll(req);

      expect(result).toEqual(mockStudents);
      expect(service.findAll).toHaveBeenCalledWith(
        "33e3c153-3f49-4e08-8cf6-8dc280587fe0",
      );
    });
  });

  describe("findOne", () => {
    it("should return a single student", async () => {
      const mockStudent = { id: "1", studentName: "John Doe" };
      mockStudentService.findOne.mockResolvedValue(mockStudent);

      const req = { instituteId: "inst-1" };
      const result = await controller.findOne("1", req);

      expect(result).toEqual(mockStudent);
      expect(service.findOne).toHaveBeenCalledWith("1", "inst-1");
    });

    it("should throw NotFoundException if student not found", async () => {
      mockStudentService.findOne.mockResolvedValue(null);

      const req = { instituteId: "inst-1" };
      await expect(controller.findOne("999", req)).rejects.toThrow(
        "Student with ID 999 not found",
      );
    });
  });
});
