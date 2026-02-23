import { Test, TestingModule } from "@nestjs/testing";
import { SlcService, SlcData } from "./slc.service";
import { PrismaService } from "../../prisma/prisma.service";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { NotFoundException } from "@nestjs/common";

describe("SlcService", () => {
  let service: SlcService;
  let prisma: PrismaService;

  const mockPrismaService = {
    student: {
      findFirst: vi.fn(),
    },
    institute: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlcService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SlcService>(SlcService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getStudentSlcData", () => {
    it("should return student and institute data", async () => {
      const mockStudent = {
        id: "student-1",
        fullName: "John Doe",
        instituteId: "inst-1",
      };
      const mockInstitute = { id: "inst-1", name: "Test Institute" };

      mockPrismaService.student.findFirst.mockResolvedValue(mockStudent);
      mockPrismaService.institute.findUnique.mockResolvedValue(mockInstitute);

      const result = await service.getStudentSlcData("student-1", "inst-1");

      expect(result).toEqual({
        student: mockStudent,
        institute: mockInstitute,
      });
      expect(prisma.student.findFirst).toHaveBeenCalledWith({
        where: { id: "student-1", instituteId: "inst-1" },
      });
      expect(prisma.institute.findUnique).toHaveBeenCalledWith({
        where: { id: "inst-1" },
      });
    });

    it("should throw NotFoundException if student not found", async () => {
      mockPrismaService.student.findFirst.mockResolvedValue(null);

      await expect(
        service.getStudentSlcData("invalid", "inst-1"),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if institute not found", async () => {
      mockPrismaService.student.findFirst.mockResolvedValue({ id: "s1" });
      mockPrismaService.institute.findUnique.mockResolvedValue(null);

      await expect(service.getStudentSlcData("s1", "invalid")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("generateSlcPdf", () => {
    const dummySlcData: SlcData = {
      studentId: "ST123",
      uidNumber: "1234567890",
      fullName: "John Doe",
      motherName: "Jane Doe",
      nationality: "Indian",
      motherTongue: "Hindi",
      religion: "Hindu",
      caste: "General",
      subCaste: "None",
      birthPlace: "Mumbai",
      dateOfBirth: "01/01/2010",
      dateOfBirthInWords: "First January Two Thousand Ten",
      previousSchool: "Old School",
      dateOfAdmission: "01/01/2020",
      admissionClass: "5th",
      educationalProgress: "Good",
      behaviour: "Excellent",
      dateOfLeaving: "01/01/2025",
      lastClass: "10th",
      periodOfLearning: "5 years",
      reasonForLeaving: "Completed 10th",
      remark: "Passed with distinction",
    };

    it("should generate a PDF buffer", async () => {
      mockPrismaService.institute.findUnique.mockResolvedValue({
        id: "inst-1",
        name: "Test Institute",
        schoolCode: "123",
      });

      const buffer = await service.generateSlcPdf(dummySlcData, "inst-1");

      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it("should throw NotFoundException if institute not found", async () => {
      mockPrismaService.institute.findUnique.mockResolvedValue(null);

      await expect(
        service.generateSlcPdf(dummySlcData, "invalid"),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
