import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { TenancyMiddleware } from "./tenancy.middleware";
import { TenancyGuard } from "./tenancy.guard";

@Module({
    providers: [TenancyGuard],
    exports: [TenancyGuard],
})
export class TenancyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TenancyMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
