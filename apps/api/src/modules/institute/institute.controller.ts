import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    UnauthorizedException,
    Req,
} from "@nestjs/common";
import { InstituteService } from "./institute.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformRole } from "@instituteos/database";
import * as bcrypt from "bcrypt";

@Controller("institutes")
export class InstituteController {
    constructor(private readonly instituteService: InstituteService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body()
        body: {
            name: string;
            domain: string;
            adminEmail: string;
            adminName: string;
        },
        @Req() req: any,
    ) {
        // Only Platform Super Admins can create institutes
        if (
            req.user.target !== "platform" ||
            req.user.role !== PlatformRole.SUPER_ADMIN
        ) {
            throw new UnauthorizedException("Only Super Admins can create institutes");
        }

        // Default password for new admins (should be changed on first login)
        const passwordHash = await bcrypt.hash("Welcome@123", 12);

        return this.instituteService.createInstitute({
            ...body,
            passwordHash,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req: any) {
        if (req.user.target !== "platform") {
            throw new UnauthorizedException("Only platform users can list institutes");
        }
        return this.instituteService.getAllInstitutes();
    }
}
