import { PrismaClient } from "@instituteos/database";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

async function main() {
    const prisma = new PrismaClient();
    const jwtService = new JwtService({
        secret: process.env.JWT_SECRET || "your-super-secret-key",
    });

    const user = await prisma.user.findFirst({
        where: { email: "admin@elite.com" },
        include: {
            roles: {
                include: { role: true },
            },
        },
    });

    if (!user) {
        console.error("User not found");
        return;
    }

    const payload = {
        sub: user.id,
        email: user.email,
        instituteId: user.instituteId,
        roles: user.roles.map((r) => r.role.name),
        target: "institute",
    };

    const token = jwtService.sign(payload);
    console.log(`Token: ${token}`);

    await prisma.$disconnect();
}

main().catch(console.error);
