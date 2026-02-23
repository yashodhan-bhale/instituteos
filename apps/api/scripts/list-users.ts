import { PrismaClient } from "@instituteos/database";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Platform Users ---");
    const platformUsers = await prisma.platformUser.findMany();
    platformUsers.forEach(u => {
        console.log(`- ${u.email} (${u.role}) [Active: ${u.isActive}]`);
    });

    console.log("\n--- Institute Users ---");
    const users = await prisma.user.findMany({
        include: {
            roles: {
                include: { role: true }
            },
            institute: true
        }
    });

    users.forEach(u => {
        const roles = u.roles.map(r => r.role.name).join(", ");
        console.log(`- ${u.email} [${u.institute.domain}] (${roles}) [Active: ${u.isActive}]`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
