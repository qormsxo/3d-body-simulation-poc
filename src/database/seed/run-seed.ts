import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

/**
 * 독립 실행 시딩 스크립트. `npm run seed` 로 실행하며,
 * DB/Redis 인프라(docker-compose)가 기동된 상태에서 사용한다.
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'warn', 'error'] });
  const seedService = app.get(SeedService);
  await seedService.seedAll();
  await app.close();
}

bootstrap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('시딩 중 오류가 발생했습니다:', error);
    process.exit(1);
  });
