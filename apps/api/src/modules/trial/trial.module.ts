import { Module } from "@nestjs/common";
import { TrialInterceptor } from "./trial.interceptor";
import { UsageTrackerInterceptor } from "./usage-tracker.interceptor";

@Module({
    providers: [TrialInterceptor, UsageTrackerInterceptor],
    exports: [TrialInterceptor, UsageTrackerInterceptor],
})
export class TrialModule { }
