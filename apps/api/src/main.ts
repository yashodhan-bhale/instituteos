import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  console.log("Starting NestJS application bootstrap...");
  try {
    const app = await NestFactory.create(AppModule);
    console.log("NestJS application created.");

    app.setGlobalPrefix("api/v1");

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://localhost:19006",
      ],
      credentials: true,
    });

    // Force port 3001 to avoid conflicts with Next.js or other services being auto-detected as 3000
    const port = 3001;
    await app.listen(port);
    console.log(`🚀 InstituteOS API running on http://localhost:${port}`);
  } catch (err) {
    console.error("FATAL ERROR during bootstrap:", err);
    process.exit(1);
  }
}
bootstrap();
