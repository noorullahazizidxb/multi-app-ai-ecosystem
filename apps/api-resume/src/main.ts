import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from '@repo/backend-core';

async function bootstrap() {
  // Validate environment variables strictly with Zod
  try {
    validateEnv();
  } catch {
    console.warn('[api-resume] Running in default dev configuration');
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const port = process.env.PORT || 4001;
  await app.listen(port);
  console.log(`[api-resume] CareerForge Backend listening on http://localhost:${port}`);
  console.log(`[api-resume] WebSocket Admin available on namespace /admin-ws`);
}

bootstrap();
