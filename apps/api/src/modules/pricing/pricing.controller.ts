import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { PricingService } from "./pricing.service";
import { TenancyGuard } from "../tenancy/tenancy.guard";

@Controller("pricing")
@UseGuards(TenancyGuard)
export class PricingController {
    constructor(private readonly pricingService: PricingService) { }

    @Get("calculate")
    async getInstitutePricing(@Req() req: Request) {
        return this.pricingService.calculateForInstitute(req.instituteId!);
    }

    @Post("simulate")
    async simulatePricing(
        @Body() body: { activeModules: string[]; studentCount: number }
    ) {
        return this.pricingService.calculateAnnualFee(
            body.activeModules,
            body.studentCount
        );
    }
}
