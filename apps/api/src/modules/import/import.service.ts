import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { StudentFormat1Strategy } from "./strategies/student-format-1.strategy";
import { ImportResult } from "./strategies/base-import.strategy";
import * as XLSX from "xlsx";

@Injectable()
export class ImportService {
  private strategies = [new StudentFormat1Strategy()];

  constructor(private readonly prisma: PrismaService) {}

  async importStudents(
    fileBuffer: Buffer,
    format: string,
    instituteId: string,
  ): Promise<ImportResult> {
    const strategy = this.strategies.find((s) => s.propertyName === format);
    if (!strategy) {
      throw new BadRequestException(`Unsupported import format: ${format}`);
    }

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      return {
        success: false,
        importedCount: 0,
        message: "Excel sheet is empty or invalid.",
      };
    }

    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const { entities, errors } = strategy.parseAndValidate(
      rawData,
      instituteId,
    );

    if (errors.length > 0) {
      return {
        success: false,
        importedCount: 0,
        errors,
        message: "Validation failed for some rows.",
      };
    }

    const grNosInFile = entities
      .map((e) => e.grNo)
      .filter((gn): gn is string => !!gn);

    const uniqueGrNosInFile = new Set(grNosInFile);
    if (uniqueGrNosInFile.size !== grNosInFile.length) {
      return {
        success: false,
        importedCount: 0,
        message: "Duplicate GR Numbers found within the uploaded file.",
      };
    }

    if (grNosInFile.length > 0) {
      const existingStudents = await this.prisma.student.findMany({
        where: {
          instituteId,
          grNo: { in: grNosInFile },
        },
        select: { grNo: true },
      });

      if (existingStudents.length > 0) {
        const duplicates = existingStudents.map((s) => s.grNo).join(", ");
        return {
          success: false,
          importedCount: 0,
          message: `GR Numbers already exist in the database: ${duplicates}`,
        };
      }
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.student.createMany({
          data: entities,
        });
      });

      return {
        success: true,
        importedCount: entities.length,
        message: `Successfully imported ${entities.length} students.`,
      };
    } catch (error: any) {
      return {
        success: false,
        importedCount: 0,
        message: `Database error during import: ${error.message}`,
      };
    }
  }
}
