import { PrismaClient } from "@instituteos/database";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@elite.com";
    const password = "Welcome@123";

    console.log(`Setting password for ${email} to ${password}...`);

    const user = await prisma.user.findFirst({
        where: { email },
    });

    if (!user) {
        console.error("User not found!");
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            isActive: true
        },
    });

    console.log("Password updated successfully and user set to active.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
