import { PrismaClient } from "@instituteos/database";

const prisma = new PrismaClient();

async function main() {
    const instituteName = "Shri Arjan Khimji National High School And Junior College, Khamgaon";
    const schoolCode = "04.08.004";

    console.log(`🏫 Updating institute info...`);
    console.log(`   Name: ${instituteName}`);
    console.log(`   Code: ${schoolCode}`);

    // Find the first institute
    const institutes = await prisma.institute.findMany({ take: 1 });

    if (institutes.length === 0) {
        console.log("❌ No institute found in the database. Please create one first.");
        return;
    }

    const institute = institutes[0];
    console.log(`\n📌 Found institute: ${institute.name} (${institute.id})`);

    await prisma.institute.update({
        where: { id: institute.id },
        data: {
            name: instituteName,
            schoolCode: schoolCode,
        },
    });

    console.log("✅ Institute updated successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
