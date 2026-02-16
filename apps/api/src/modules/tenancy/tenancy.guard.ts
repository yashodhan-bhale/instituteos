import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class TenancyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const instituteId = request.instituteId;

    if (!instituteId) {
      throw new ForbiddenException(
        "Institute context is required. Provide x-institute-id header.",
      );
    }

    return true;
  }
}
