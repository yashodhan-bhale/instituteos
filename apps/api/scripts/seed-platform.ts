import { PrismaClient, PlatformRole } from "@instituteos/database";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || "admin@instituteos.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";
    const firstName = "Super";
    const lastName = "Admin";

    console.log(`🚀 Seeding Platform Admin: ${email}...`);

    const existing = await prisma.platformUser.findUnique({
        where: { email },
    });

    if (existing) {
        console.log("⚠️  Platform Admin already exists. Skipping.");
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.platformUser.create({
        data: {
            email,
            passwordHash,
            firstName,
            lastName,
            role: PlatformRole.SUPER_ADMIN,
        },
    });

    console.log("✅ Platform Admin created successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
