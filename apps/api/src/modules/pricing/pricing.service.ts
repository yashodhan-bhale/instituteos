import { Injectable } from "@nestjs/common";
import {
  PRICING_CONFIG,
  MODULE_FEES,
  PricingCalculation,
} from "@instituteos/shared-types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The "Oxygen Formula":
   * AnnualFee = clamp((BaseFee + ModuleFees + (StudentCount * 10)), 2000, 20000)
   */
  calculateAnnualFee(
    activeModules: string[],
    studentCount: number,
  ): PricingCalculation {
    const { baseFee, perStudentFee, minAnnualFee, maxAnnualFee } =
      PRICING_CONFIG;

    const moduleFees = activeModules.reduce((sum, mod) => {
      return sum + (MODULE_FEES[mod] || 0);
    }, 0);

    const studentFee = studentCount * perStudentFee;
    const rawTotal = baseFee + moduleFees + studentFee;
    const annualFee = Math.max(minAnnualFee, Math.min(maxAnnualFee, rawTotal));

    return {
      baseFee,
      moduleFees,
      studentFee,
      rawTotal,
      annualFee,
    };
  }

  async calculateForInstitute(
    instituteId: string,
  ): Promise<PricingCalculation> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { instituteId },
    });

    if (!subscription) {
      return this.calculateAnnualFee([], 0);
    }

    return this.calculateAnnualFee(
      subscription.activeModules,
      subscription.studentCount,
    );
  }

  async updateSubscriptionPricing(instituteId: string): Promise<void> {
    const pricing = await this.calculateForInstitute(instituteId);

    await this.prisma.subscription.update({
      where: { instituteId },
      data: { annualFee: pricing.annualFee },
    });
  }
}
