import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    @Get("health")
    healthCheck() {
        return {
            status: "ok",
            service: "InstituteOS API",
            timestamp: new Date().toISOString(),
        };
    }
}
