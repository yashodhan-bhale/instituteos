import { PrismaClient } from "@instituteos/database";

const prisma = new PrismaClient();

async function main() {
    const studentCount = await prisma.student.count();
    console.log(`Total Students in DB: ${studentCount}`);

    const institutes = await prisma.institute.findMany({
        include: {
            _count: {
                select: { students: true }
            }
        }
    });

    console.log("\nInstitutes and their student counts:");
    institutes.forEach(i => {
        console.log(`- ${i.name} (${i.domain}): ${i._count.students} students`);
    });

    const orphanStudents = await prisma.student.count({
        where: { instituteId: { equals: undefined } }
    });
    console.log(`\nOrphan Students (no instituteId): ${orphanStudents}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
