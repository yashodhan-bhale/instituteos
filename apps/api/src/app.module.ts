import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TenancyModule } from "./modules/tenancy/tenancy.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { TrialModule } from "./modules/trial/trial.module";
import { TaskModule } from "./modules/task/task.module";
import { SignalModule } from "./modules/signal/signal.module";
import { ImportModule } from "./modules/import/import.module";
import { InstituteModule } from "./modules/institute/institute.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    TenancyModule,
    AuthModule,
    PricingModule,
    TrialModule,
    TaskModule,
    SignalModule,
    ImportModule,
    InstituteModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
