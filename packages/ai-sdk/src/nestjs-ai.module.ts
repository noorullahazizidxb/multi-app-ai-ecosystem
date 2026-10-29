import { Module, Global, DynamicModule } from '@nestjs/common';
import { GeminiClient, GeminiConfig } from './client';
import { TokenMeter } from './token-meter';

@Global()
@Module({})
export class AiSdkModule {
  static forRoot(config?: Partial<GeminiConfig>): DynamicModule {
    return {
      module: AiSdkModule,
      providers: [
        {
          provide: GeminiClient,
          useFactory: () => new GeminiClient(config),
        },
        {
          provide: TokenMeter,
          useFactory: () => new TokenMeter(),
        },
      ],
      exports: [GeminiClient, TokenMeter],
    };
  }
}
