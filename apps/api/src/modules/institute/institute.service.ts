import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRole } from "@instituteos/database";

@Injectable()
export class InstituteService {
  constructor(private readonly prisma: PrismaService) {}

  async createInstitute(data: {
    name: string;
    domain: string;
    adminEmail: string;
    adminName: string;
    passwordHash: string;
  }) {
    // 1. Check if domain is taken
    const existing = await this.prisma.institute.findUnique({
      where: { domain: data.domain },
    });
    if (existing) {
      throw new BadRequestException("Domain already in use");
    }

    return await this.prisma.$transaction(async (tx) => {
      // 2. Create Institute
      const institute = await tx.institute.create({
        data: {
          name: data.name,
          domain: data.domain,
        },
      });

      // 3. Create Default Roles
      const roles = await Promise.all([
        tx.role.create({
          data: {
            instituteId: institute.id,
            name: UserRole.INSTITUTE_ADMIN,
            description: "Full access to institute operations",
            permissions: ["*"],
          },
        }),
        tx.role.create({
          data: {
            instituteId: institute.id,
            name: UserRole.PRINCIPAL,
            description: "Manage staff and students",
            permissions: ["manage_staff", "manage_students"],
          },
        }),
      ]);

      // 4. Create Initial Admin User
      const [firstName, ...lastNameParts] = data.adminName.split(" ");
      const user = await tx.user.create({
        data: {
          instituteId: institute.id,
          email: data.adminEmail,
          passwordHash: data.passwordHash,
          firstName: firstName,
          lastName: lastNameParts.join(" ") || "",
        },
      });

      // 5. Assign Admin Role
      const adminRole = roles.find((r) => r.name === UserRole.INSTITUTE_ADMIN);
      if (adminRole) {
        await tx.userRole_Assignment.create({
          data: {
            userId: user.id,
            roleId: adminRole.id,
          },
        });
      }

      // 6. Initialize Subscription & ROI
      await tx.subscription.create({
        data: { instituteId: institute.id },
      });
      await tx.roiStats.create({
        data: { instituteId: institute.id },
      });

      return institute;
    });
  }

  async getAllInstitutes() {
    return this.prisma.institute.findMany({
      include: {
        _count: {
          select: { users: true, students: true },
        },
      },
    });
  }
}
