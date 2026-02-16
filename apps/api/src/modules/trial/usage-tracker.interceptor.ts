import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Usage Tracker Interceptor
 *
 * Logs feature usage to FeatureUsageLog for ROI reporting.
 * Extracts module_key and feature_key from the route metadata.
 */
@Injectable()
export class UsageTrackerInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const instituteId = request.instituteId;
    const userId = request.user?.id;

    if (!instituteId) {
      return next.handle();
    }

    // Extract module and feature from the route path
    const path = request.route?.path || request.url;
    const { moduleKey, featureKey } = this.extractKeys(path);

    return next.handle().pipe(
      tap(async () => {
        // Fire-and-forget: don't block the response
        try {
          await this.prisma.featureUsageLog.create({
            data: {
              instituteId,
              moduleKey,
              featureKey,
              userId: userId || null,
            },
          });
        } catch {
          // Silently fail — telemetry should never break the request
        }
      }),
    );
  }

  private extractKeys(path: string): {
    moduleKey: string;
    featureKey: string;
  } {
    // Parse path like /api/v1/tasks/create -> module: TASKS, feature: CREATE
    const segments = path.split("/").filter(Boolean);
    const moduleKey = (segments[2] || "UNKNOWN").toUpperCase();
    const featureKey = (segments[3] || "LIST").toUpperCase();

    return { moduleKey, featureKey };
  }
}
