import { Test, TestingModule } from "@nestjs/testing";
import { SlcController } from "./slc.controller";
import { SlcService, SlcData } from "./slc.service";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("SlcController", () => {
  let controller: SlcController;
  let service: SlcService;

  const mockSlcService = {
    getStudentSlcData: vi.fn(),
    generateSlcPdf: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlcController],
      providers: [
        {
          provide: SlcService,
          useValue: mockSlcService,
        },
      ],
    }).compile();

    controller = module.get<SlcController>(SlcController);
    service = module.get<SlcService>(SlcService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getSlcData", () => {
    it("should return student data from service", async () => {
      const mockData = { student: { id: "1" }, institute: { id: "inst-1" } };
      mockSlcService.getStudentSlcData.mockResolvedValue(mockData);

      const req = { instituteId: "inst-1" };
      const result = await controller.getSlcData("1", req);

      expect(result).toEqual(mockData);
      expect(service.getStudentSlcData).toHaveBeenCalledWith("1", "inst-1");
    });
  });

  describe("generateSlc", () => {
    const dummySlcData: SlcData = {
      studentId: "ST123",
      fullName: "John Doe",
      // ... other fields (omitted for brevity as we mock service return)
    } as SlcData;

    it("should call service.generateSlcPdf and return PDF response", async () => {
      const mockBuffer = Buffer.from("pdf-content");
      mockSlcService.generateSlcPdf.mockResolvedValue(mockBuffer);

      const req = { instituteId: "inst-1" };
      const res = {
        set: vi.fn(),
        end: vi.fn(),
      };

      await controller.generateSlc("1", dummySlcData, req, res as any);

      expect(service.generateSlcPdf).toHaveBeenCalledWith(
        dummySlcData,
        "inst-1",
      );
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          "Content-Type": "application/pdf",
          "Content-Disposition": expect.stringContaining("SLC-John_Doe.pdf"),
        }),
      );
      expect(res.end).toHaveBeenCalledWith(mockBuffer);
    });
  });
});
