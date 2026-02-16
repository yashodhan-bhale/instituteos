import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../prisma/prisma.service";

// Extend Express Request to include tenancy context
declare global {
  namespace Express {
    interface Request {
      instituteId?: string;
    }
  }
}

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) { }

  async use(req: Request, _res: Response, next: NextFunction) {
    // 1. Check Header (Developer/Direct Override)
    let instituteId: string | undefined = req.headers["x-institute-id"] as string;

    // 2. Check Subdomain if no header
    if (!instituteId) {
      instituteId = await this.extractFromSubdomain(req);
    }

    if (instituteId) {
      req.instituteId = instituteId;
    }

    next();
  }

  private async extractFromSubdomain(req: Request): Promise<string | undefined> {
    const host = req.headers.host;
    if (!host) return undefined;

    // Pattern: <subdomain>.instituteos.app or <subdomain>.localhost:3000
    const parts = host.split(".");

    // For local development on localhost or lvh.me
    // lvh.me points to 127.0.0.1, so oxford.lvh.me works
    if (parts.length >= 2) {
      const subdomain = parts[0].toLowerCase();

      // Special case for platform management
      if (subdomain === "platform") {
        return "PLATFORM";
      }

      // Look up institute by domain
      const institute = await this.prisma.institute.findUnique({
        where: { domain: subdomain },
        select: { id: true },
      });

      return institute?.id;
    }

    return undefined;
  }
}
