import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";

export interface JwtPayload {
  sub: string;
  email: string;
  instituteId: string;
  roles: string[];
  target: "platform" | "institute";
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, instituteId?: string) {
    const whereClause: any = { email };
    if (instituteId) {
      whereClause.instituteId = instituteId;
    }

    const user = await this.prisma.user.findFirst({
      where: whereClause,
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      instituteId: user.instituteId,
      roles: user.roles.map((r) => r.role.name),
      target: "institute",
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        instituteId: user.instituteId,
        roles: user.roles.map((r) => r.role.name),
        target: "institute",
      },
    };
  }

  async platformLogin(email: string, password: string) {
    const user = await this.prisma.platformUser.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      instituteId: "PLATFORM",
      roles: [user.role],
      target: "platform",
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        target: "platform",
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    instituteId: string;
    roleName: string;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        instituteId: data.instituteId,
      },
    });

    // Assign role
    const role = await this.prisma.role.findFirst({
      where: {
        instituteId: data.instituteId,
        name: data.roleName as any,
      },
    });

    if (role) {
      await this.prisma.userRole_Assignment.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }

    return { id: user.id, email: user.email };
  }

  async validateUser(payload: JwtPayload) {
    if (payload.target === "platform") {
      const user = await this.prisma.platformUser.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedException("Platform user not found or inactive");
      }
      return { ...user, target: "platform" };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Institute user not found or inactive");
    }

    return { ...user, target: "institute" };
  }
}
