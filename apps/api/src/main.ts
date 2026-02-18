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
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        if (!origin) return callback(null, true);
        try {
          const url = new URL(origin);
          if (
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1" ||
            url.hostname.endsWith(".localhost")
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        } catch {
          callback(null, true);
        }
      },
      credentials: true,
    });

    // Force port 3001 and listen on all interfaces
    const port = 3001;
    await app.listen(port, "0.0.0.0");
    console.log(`🚀 InstituteOS API running on http://127.0.0.1:${port}`);
  } catch (err) {
    console.error("FATAL ERROR during bootstrap:", err);
    process.exit(1);
  }
}
bootstrap();
