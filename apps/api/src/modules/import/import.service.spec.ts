import { Test, TestingModule } from "@nestjs/testing";
import { ImportService } from "./import.service";
import { PrismaService } from "../../prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";
import * as XLSX from "xlsx";

import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("xlsx", () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn(),
  },
}));

describe("ImportService", () => {
  let service: ImportService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              findMany: vi.fn(),
              createMany: vi.fn(),
            },
            $transaction: vi.fn((callback) =>
              callback({
                student: {
                  createMany: vi.fn().mockResolvedValue({ count: 1 }),
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw BadRequestException for unsupported format", async () => {
    const buffer = Buffer.from([]);
    await expect(
      service.importStudents(buffer, "invalid-format", "inst-1"),
    ).rejects.toThrow(BadRequestException);
  });

  it("should return error if studentName is missing", async () => {
    const buffer = Buffer.from("dummy");
    (XLSX.read as any).mockReturnValue({
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ["Student Name"], // Header
      [""], // Empty name
    ]);

    const result = await service.importStudents(buffer, "format-1", "inst-1");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Validation failed");
    expect(result.errors?.[0].errors).toContain("Student Name is required.");
  });

  it("should return error for duplicate GR No. in file", async () => {
    const buffer = Buffer.from("dummy");
    (XLSX.read as any).mockReturnValue({
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ["Student Name", "GR No."],
      ["John Doe", "GR001"],
      ["Jane Doe", "GR001"], // Duplicate
    ]);

    const result = await service.importStudents(buffer, "format-1", "inst-1");
    expect(result.success).toBe(false);
    expect(result.message).toContain(
      "Duplicate GR Numbers found within the uploaded file",
    );
  });

  it("should return error for duplicate GR No. in database", async () => {
    const buffer = Buffer.from("dummy");
    (XLSX.read as any).mockReturnValue({
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ["Student Name", "GR No."],
      ["John Doe", "GR001"],
    ]);

    (prisma.student.findMany as any).mockResolvedValue([{ grNo: "GR001" }]);

    const result = await service.importStudents(buffer, "format-1", "inst-1");
    expect(result.success).toBe(false);
    expect(result.message).toContain(
      "GR Numbers already exist in the database",
    );
  });

  it("should successfully import valid data", async () => {
    const buffer = Buffer.from("dummy");
    (XLSX.read as any).mockReturnValue({
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: {} },
    });
    (XLSX.utils.sheet_to_json as any).mockReturnValue([
      ["Student Name", "GR No."],
      ["John Doe", "GR001"],
    ]);

    (prisma.student.findMany as any).mockResolvedValue([]);

    const result = await service.importStudents(buffer, "format-1", "inst-1");
    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(1);
  });
});
