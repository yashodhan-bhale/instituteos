import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImportService } from "./import.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("import")
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post("students")
  @UseInterceptors(FileInterceptor("file"))
  async uploadStudents(
    @UploadedFile() file: any,
    @Body("format") format: string,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    if (!format) {
      throw new BadRequestException(
        "Import format (e.g. 'format-1') is required",
      );
    }

    // Get instituteId from the tenancy middleware context
    const instituteId = req.instituteId;

    if (!instituteId) {
      throw new BadRequestException(
        "Institute context not found. Please access via the correct subdomain.",
      );
    }

    return this.importService.importStudents(file.buffer, format, instituteId);
  }
}
