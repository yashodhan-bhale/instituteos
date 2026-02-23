import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { SlcService, SlcData } from "./slc.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("students")
@UseGuards(JwtAuthGuard)
export class SlcController {
  constructor(private readonly slcService: SlcService) {}

  /**
   * GET /students/:id/slc-data
   * Returns the student + institute data for pre-filling the SLC modal
   */
  @Get(":id/slc-data")
  async getSlcData(@Param("id") id: string, @Req() req: any) {
    const instituteId =
      req.instituteId || "33e3c153-3f49-4e08-8cf6-8dc280587fe0";
    return this.slcService.getStudentSlcData(id, instituteId);
  }

  /**
   * POST /students/:id/slc
   * Generates and returns the SLC PDF with the provided data
   */
  @Post(":id/slc")
  async generateSlc(
    @Param("id") id: string,
    @Body() slcData: SlcData,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const instituteId =
      req.instituteId || "33e3c153-3f49-4e08-8cf6-8dc280587fe0";

    const pdfBuffer = await this.slcService.generateSlcPdf(
      slcData,
      instituteId,
    );

    const safeName = (slcData.fullName || "student")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="SLC-${safeName}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
