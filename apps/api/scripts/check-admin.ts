import { PrismaClient } from "@instituteos/database";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://instituteos:instituteos_dev_pw@127.0.0.1:5432/instituteos_dev?schema=public"
        }
    }
});

async function main() {
    const users = await prisma.platformUser.findMany();
    if (users.length === 0) {
        console.log("❌ No platform users found in the database.");
    } else {
        console.log(`✅ Found ${users.length} platform user(s):`);
        users.forEach((u) => {
            console.log(`  - ${u.email} | role: ${u.role} | isActive: ${u.isActive}`);
        });
    }
}

main()
    .catch((e) => {
        console.error("Error:", e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
