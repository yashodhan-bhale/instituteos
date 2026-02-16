import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Trial Interceptor - Graceful Degradation
 *
 * If trial_start_date > 60 days ago AND not paid:
 *   - Block POST/PUT/DELETE methods
 *   - Allow GET (read-only access)
 */
@Injectable()
export class TrialInterceptor implements NestInterceptor {
  private static readonly TRIAL_DURATION_DAYS = 60;
  private static readonly WRITE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const instituteId = request.instituteId;
    const method = request.method;

    // Skip check if no institute context or GET request
    if (!instituteId || !TrialInterceptor.WRITE_METHODS.includes(method)) {
      return next.handle();
    }

    const institute = await this.prisma.institute.findUnique({
      where: { id: instituteId },
      include: { subscription: true },
    });

    if (!institute) {
      return next.handle();
    }

    // Check if subscription is paid
    if (institute.subscription?.isPaid) {
      return next.handle();
    }

    // Check if trial has expired (> 60 days)
    const trialStartDate = institute.trialStartDate;
    const daysSinceStart = Math.floor(
      (Date.now() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceStart > TrialInterceptor.TRIAL_DURATION_DAYS) {
      throw new ForbiddenException({
        error: "TRIAL_EXPIRED",
        message: `Your ${TrialInterceptor.TRIAL_DURATION_DAYS}-day trial has expired. Please upgrade to continue using write operations.`,
        trialDays: daysSinceStart,
        action: "UPGRADE_REQUIRED",
      });
    }

    return next.handle();
  }
}
