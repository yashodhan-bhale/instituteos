import { Test, TestingModule } from "@nestjs/testing";
import { InstituteController } from "./institute.controller";
import { InstituteService } from "./institute.service";
import { PlatformRole } from "@instituteos/database";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { UnauthorizedException } from "@nestjs/common";

describe("InstituteController", () => {
  let controller: InstituteController;
  let service: any;

  const mockInstituteService = {
    createInstitute: vi.fn(),
    getInstituteById: vi.fn(),
    getAllInstitutes: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstituteController],
      providers: [
        {
          provide: InstituteService,
          useValue: mockInstituteService,
        },
      ],
    }).compile();

    controller = module.get<InstituteController>(InstituteController);
    service = module.get<InstituteService>(InstituteService);
    vi.clearAllMocks();
  });

  describe("create", () => {
    const createDto = {
      name: "New Inst",
      domain: "new",
      adminEmail: "admin@new.com",
      adminName: "Admin",
    };

    it("should throw UnauthorizedException if user is not platform super admin", async () => {
      const req = { user: { target: "institute", role: "ADMIN" } };
      await expect(controller.create(createDto, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should call service if user is platform super admin", async () => {
      const req = {
        user: { target: "platform", role: PlatformRole.SUPER_ADMIN },
      };
      mockInstituteService.createInstitute.mockResolvedValue({ id: "1" });

      await controller.create(createDto, req);

      expect(service.createInstitute).toHaveBeenCalled();
    });
  });

  describe("findMe", () => {
    it("should throw UnauthorizedException if no institute context", async () => {
      const req = { instituteId: undefined };
      await expect(controller.findMe(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should call service with instituteId from request", async () => {
      const req = { instituteId: "inst-123" };
      mockInstituteService.getInstituteById.mockResolvedValue({
        id: "inst-123",
      });

      await controller.findMe(req);

      expect(service.getInstituteById).toHaveBeenCalledWith("inst-123");
    });
  });

  describe("findAll", () => {
    it("should throw UnauthorizedException if not a platform user", async () => {
      const req = { user: { target: "institute" } };
      await expect(controller.findAll(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should return all institutes for platform users", async () => {
      const req = { user: { target: "platform" } };
      mockInstituteService.getAllInstitutes.mockResolvedValue([]);

      await controller.findAll(req);

      expect(service.getAllInstitutes).toHaveBeenCalled();
    });
  });
});
