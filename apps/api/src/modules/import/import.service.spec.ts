import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from './import.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ImportService', () => {
    let service: ImportService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImportService,
                {
                    provide: PrismaService,
                    useValue: {
                        student: {
                            findMany: jest.fn(),
                            createMany: jest.fn(),
                        },
                        $transaction: jest.fn((callback) => callback(prisma)),
                    },
                },
            ],
        }).compile();

        service = module.get<ImportService>(ImportService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should throw BadRequestException for unsupported format', async () => {
        const buffer = Buffer.from([]);
        await expect(service.importStudents(buffer, 'invalid-format', 'inst-1'))
            .rejects.toThrow(BadRequestException);
    });
});
