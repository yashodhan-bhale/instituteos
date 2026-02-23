import { Test, TestingModule } from "@nestjs/testing";
import { InstituteService } from "./institute.service";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRole } from "@instituteos/database";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BadRequestException } from "@nestjs/common";

describe("InstituteService", () => {
  let service: InstituteService;

  const mockTx = {
    institute: {
      create: vi.fn(),
    },
    role: {
      create: vi.fn(),
    },
    user: {
      create: vi.fn(),
    },
    userRole_Assignment: {
      create: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
    },
    roiStats: {
      create: vi.fn(),
    },
  };

  const mockPrismaService = {
    institute: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => {
      if (typeof cb === "function") {
        return cb(mockTx);
      }
      return cb;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstituteService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InstituteService>(InstituteService);
    vi.clearAllMocks();
  });

  describe("createInstitute", () => {
    const createData = {
      name: "Test Institute",
      domain: "test",
      adminEmail: "admin@test.com",
      adminName: "Admin User",
      passwordHash: "hashed-pw",
    };

    it("should throw BadRequestException if domain is already in use", async () => {
      mockPrismaService.institute.findUnique.mockResolvedValue({
        id: "existing",
      });

      await expect(service.createInstitute(createData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should successfully create an institute with roles and admin user", async () => {
      mockPrismaService.institute.findUnique.mockResolvedValue(null);
      const mockInstitute = {
        id: "new-inst-id",
        name: createData.name,
        domain: createData.domain,
      };
      const mockAdminRole = { id: "role-id", name: UserRole.INSTITUTE_ADMIN };
      const mockUser = { id: "user-id", email: createData.adminEmail };

      mockTx.institute.create.mockResolvedValue(mockInstitute);
      mockTx.role.create
        .mockResolvedValueOnce(mockAdminRole)
        .mockResolvedValueOnce({ id: "p-role-id", name: UserRole.PRINCIPAL });
      mockTx.user.create.mockResolvedValue(mockUser);

      const result = await service.createInstitute(createData);

      expect(result).toEqual(mockInstitute);
    });
  });

  describe("getInstituteById", () => {
    it("should return institute with student and user counts", async () => {
      const mockInstitute = {
        id: "inst-1",
        name: "Test Institute",
        _count: { users: 5, students: 10 },
      };
      mockPrismaService.institute.findUnique.mockResolvedValue(mockInstitute);

      const result = await service.getInstituteById("inst-1");

      expect(result).toEqual(mockInstitute);
    });
  });
});
