import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiTasksModule } from './ai-tasks/ai-tasks.module';
import { BodyDataModule } from './body-data/body-data.module';
import { CacheModule } from './common/cache/cache.module';
import { SeedModule } from './database/seed/seed.module';
import { DesignWorkflowModule } from './design-workflow/design-workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', '3d'),
        password: configService.get<string>('DB_PASSWORD', '3d_pass'),
        database: configService.get<string>('DB_DATABASE', '3d'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    CacheModule,
    SeedModule,
    BodyDataModule,
    DesignWorkflowModule,
    AiTasksModule,
  ],
})
export class AppModule {}
