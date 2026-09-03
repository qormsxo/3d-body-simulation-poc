import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { CacheService } from '../common/cache/cache.service';
import { GuidelinePageDto } from './dto/guideline-page.dto';
import { QueryGuidelinesDto } from './dto/query-guidelines.dto';
import { BodyData } from './entities/body-data.entity';

const CACHE_KEY_PREFIX = 'body-data:guidelines';

@Injectable()
export class BodyDataService {
  private readonly logger = new Logger(BodyDataService.name);
  private readonly cacheTtlSeconds: number;

  constructor(
    @InjectRepository(BodyData) private readonly bodyDataRepository: Repository<BodyData>,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtlSeconds = this.configService.get<number>('BODY_DATA_CACHE_TTL_SECONDS', 60);
  }

  async findGuidelines(query: QueryGuidelinesDto): Promise<GuidelinePageDto> {
    const cacheKey = this.buildCacheKey(query);

    const cached = await this.cacheService.get<Omit<GuidelinePageDto, 'fromCache'>>(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    const fresh = await this.queryFromDatabase(query);
    await this.cacheService.set(cacheKey, fresh, this.cacheTtlSeconds);
    return { ...fresh, fromCache: false };
  }

  private async queryFromDatabase(
    query: QueryGuidelinesDto,
  ): Promise<Omit<GuidelinePageDto, 'fromCache'>> {
    const { gender, guidelineCategory, minHeight, maxHeight, minWeight, maxWeight, page, limit } =
      query;

    const qb = this.bodyDataRepository.createQueryBuilder('bodyData');

    if (gender) {
      qb.andWhere('bodyData.gender = :gender', { gender });
    }
    if (guidelineCategory) {
      qb.andWhere('bodyData.guidelineCategory = :guidelineCategory', { guidelineCategory });
    }
    if (minHeight !== undefined) {
      qb.andWhere('bodyData.height >= :minHeight', { minHeight });
    }
    if (maxHeight !== undefined) {
      qb.andWhere('bodyData.height <= :maxHeight', { maxHeight });
    }
    if (minWeight !== undefined) {
      qb.andWhere('bodyData.weight >= :minWeight', { minWeight });
    }
    if (maxWeight !== undefined) {
      qb.andWhere('bodyData.weight <= :maxWeight', { maxWeight });
    }

    qb.orderBy('bodyData.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    this.logger.debug(`DB query executed for guidelines (cache miss): ${qb.getQuery()}`);
    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit };
  }

  private buildCacheKey(query: QueryGuidelinesDto): string {
    const normalized = JSON.stringify({
      gender: query.gender ?? null,
      guidelineCategory: query.guidelineCategory ?? null,
      minHeight: query.minHeight ?? null,
      maxHeight: query.maxHeight ?? null,
      minWeight: query.minWeight ?? null,
      maxWeight: query.maxWeight ?? null,
      page: query.page,
      limit: query.limit,
    });
    const hash = crypto.createHash('md5').update(normalized).digest('hex');
    return `${CACHE_KEY_PREFIX}:${hash}`;
  }

  async count(): Promise<number> {
    return this.bodyDataRepository.count();
  }

  async existsById(id: string): Promise<boolean> {
    const found = await this.bodyDataRepository.exist({ where: { id } });
    return found;
  }
}
