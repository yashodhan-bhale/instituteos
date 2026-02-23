import { Module } from "@nestjs/common";
import { SlcService } from "./slc.service";
import { SlcController } from "./slc.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SlcController],
  providers: [SlcService],
})
export class SlcModule {}
