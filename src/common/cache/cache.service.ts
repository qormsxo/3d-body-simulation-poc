import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

/**
 * Redis 기반 Look-Aside(Cache-Aside) 캐싱 헬퍼.
 * 1) 캐시 조회 -> 있으면 즉시 반환 (Cache Hit)
 * 2) 없으면 factory 실행 -> DB 등 원본 조회 (Cache Miss)
 * 3) 조회 결과를 TTL과 함께 캐시에 저장 후 반환
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getOrSet<T>(key: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached !== null) {
      this.logger.debug(`Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    this.logger.debug(`Cache MISS: ${key}`);
    const fresh = await factory();
    await this.redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
    return fresh;
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
