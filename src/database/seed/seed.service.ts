import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodyData } from '../../body-data/entities/body-data.entity';
import { DesignWorkflow } from '../../design-workflow/entities/design-workflow.entity';
import { generateBodyDataBatch } from './body-data.generator';
import { DESIGN_WORKFLOW_SAMPLES } from './design-workflow.samples';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(BodyData) private readonly bodyDataRepository: Repository<BodyData>,
    @InjectRepository(DesignWorkflow)
    private readonly designWorkflowRepository: Repository<DesignWorkflow>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const seedOnBootstrap = this.configService.get<string>('SEED_ON_BOOTSTRAP', 'true');
    if (seedOnBootstrap !== 'true') {
      this.logger.log('SEED_ON_BOOTSTRAP=false 이므로 자동 시딩을 건너뜁니다.');
      return;
    }
    await this.seedAll();
  }

  async seedAll(): Promise<void> {
    await this.seedDesignWorkflows();
    await this.seedBodyData();
  }

  async seedDesignWorkflows(): Promise<void> {
    const existing = await this.designWorkflowRepository.count();
    if (existing > 0) {
      this.logger.log(`DesignWorkflow 샘플 데이터가 이미 존재합니다 (${existing}건). 시딩을 건너뜁니다.`);
      return;
    }

    const workflows = this.designWorkflowRepository.create(DESIGN_WORKFLOW_SAMPLES);
    const saved = await this.designWorkflowRepository.save(workflows);
    this.logger.log(`DesignWorkflow 샘플 ${saved.length}건 시딩 완료.`);
  }

  async seedBodyData(): Promise<void> {
    const targetCount = this.configService.get<number>('BODY_DATA_SEED_COUNT', 150000);
    const batchSize = this.configService.get<number>('BODY_DATA_SEED_BATCH_SIZE', 2000);

    const currentCount = await this.bodyDataRepository.count();
    if (currentCount >= targetCount) {
      this.logger.log(
        `BodyData가 목표치(${targetCount}건)만큼 이미 존재합니다 (현재 ${currentCount}건). 시딩을 건너뜁니다.`,
      );
      return;
    }

    const remaining = targetCount - currentCount;
    this.logger.log(
      `BodyData ${remaining}건 시딩을 시작합니다 (배치 크기: ${batchSize}, 목표: ${targetCount}건)...`,
    );

    const startedAt = Date.now();
    let inserted = 0;

    while (inserted < remaining) {
      const currentBatchSize = Math.min(batchSize, remaining - inserted);
      const batch = generateBodyDataBatch(currentBatchSize);

      await this.bodyDataRepository
        .createQueryBuilder()
        .insert()
        .into(BodyData)
        .values(batch)
        .execute();

      inserted += currentBatchSize;
      this.logger.log(`BodyData 시딩 진행: ${inserted}/${remaining}`);
    }

    const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
    this.logger.log(`BodyData 시딩 완료: ${inserted}건 (${elapsedSeconds}초 소요)`);
  }
}
