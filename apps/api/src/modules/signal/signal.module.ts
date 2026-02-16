import { Module } from "@nestjs/common";
import { SignalEngineService } from "./signal-engine.service";

@Module({
  providers: [SignalEngineService],
  exports: [SignalEngineService],
})
export class SignalModule {}
