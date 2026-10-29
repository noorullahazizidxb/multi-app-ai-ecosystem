import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DynamicPrismaService } from './dynamic-prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: DynamicPrismaService,
      useFactory: () => {
        return new DynamicPrismaService();
      },
    },
  ],
  exports: [DynamicPrismaService],
})
export class PrismaModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prisma: DynamicPrismaService) {}

  async onModuleInit() {
    await this.prisma.connect();
  }

  async onModuleDestroy() {
    await this.prisma.disconnect();
  }
}

