import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from '@repo/backend-core';

async function bootstrap() {
  try {
    validateEnv();
  } catch {
    console.warn('[api-content] Running in default dev configuration');
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const port = process.env.PORT || 4004;
  await app.listen(port);
  console.log(`[api-content] ViralMatrix Backend listening on http://localhost:${port}`);
  console.log(`[api-content] Admin WebSocket on /admin-ws`);
}

bootstrap();
