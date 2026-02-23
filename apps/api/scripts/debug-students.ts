import { PrismaClient } from "@instituteos/database";

const prisma = new PrismaClient();

async function main() {
    const institutes = await prisma.institute.findMany();
    console.log("--- Institutes ---");
    institutes.forEach(i => {
        console.log(`- Name: ${i.name}, Domain: ${i.domain}, ID: ${i.id}`);
    });

    const studentCount = await prisma.student.count();
    console.log(`\nTotal Students: ${studentCount}`);

    if (studentCount > 0) {
        const sampleStudents = await prisma.student.findMany({ take: 5 });
        console.log("\n--- Sample Students (First 5) ---");
        sampleStudents.forEach(s => {
            console.log(`- ID: ${s.id}, Name: ${s.studentName}, InstituteID: ${s.instituteId}`);
        });

        // Check for specific institute ID
        if (institutes.length > 0) {
            const firstId = institutes[0].id;
            const countByInstitute = await prisma.student.count({ where: { instituteId: firstId } });
            console.log(`\nStudents linked to first institute (${institutes[0].name}): ${countByInstitute}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
