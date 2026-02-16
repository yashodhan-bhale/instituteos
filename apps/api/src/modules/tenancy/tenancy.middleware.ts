import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

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
    use(req: Request, _res: Response, next: NextFunction) {
        // Extract institute_id from header, subdomain, or JWT
        const instituteId =
            (req.headers["x-institute-id"] as string) ||
            this.extractFromSubdomain(req);

        if (instituteId) {
            req.instituteId = instituteId;
        }

        next();
    }

    private extractFromSubdomain(req: Request): string | undefined {
        const host = req.headers.host;
        if (!host) return undefined;

        // Pattern: <institute-domain>.instituteos.app
        const parts = host.split(".");
        if (parts.length >= 3 && parts[1] === "instituteos") {
            // Would look up institute by domain — for now return undefined
            return undefined;
        }

        return undefined;
    }
}
