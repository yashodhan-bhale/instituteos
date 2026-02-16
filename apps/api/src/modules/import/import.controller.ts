import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImportService } from "./import.service";

@Controller("import")
export class ImportController {
    constructor(private readonly importService: ImportService) { }

    @Post("students")
    @UseInterceptors(FileInterceptor("file"))
    async uploadStudents(
        @UploadedFile() file: any, // Using any for Express.Multer.File to avoid type issues if not registered
        @Body("format") format: string,
        @Body("instituteId") instituteId: string
    ) {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }
        if (!format) {
            throw new BadRequestException("Import format (e.g. 'format-1') is required");
        }
        if (!instituteId) {
            throw new BadRequestException("Institute ID is required");
        }

        return this.importService.importStudents(file.buffer, format, instituteId);
    }
}
