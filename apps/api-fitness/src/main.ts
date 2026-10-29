import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from '@repo/backend-core';

async function bootstrap() {
  try {
    validateEnv();
  } catch {
    console.warn('[api-fitness] Running in default dev configuration');
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const port = process.env.PORT || 4002;
  await app.listen(port);
  console.log(`[api-fitness] KineticAI Backend listening on http://localhost:${port}`);
  console.log(`[api-fitness] WebSocket Live streaming on /fitness-live`);
  console.log(`[api-fitness] Admin WebSocket on /admin-ws`);
}

bootstrap();
