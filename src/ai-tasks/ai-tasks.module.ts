import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyDataModule } from '../body-data/body-data.module';
import { DesignWorkflowModule } from '../design-workflow/design-workflow.module';
import { AiTasksController } from './ai-tasks.controller';
import { AiTasksService } from './ai-tasks.service';
import { AiGenerationTask } from './entities/ai-generation-task.entity';
import { AiGenerationProcessor } from './queue/ai-generation.processor';
import { AI_GENERATION_QUEUE } from './queue/ai-generation.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiGenerationTask]),
    BullModule.registerQueue({ name: AI_GENERATION_QUEUE }),
    DesignWorkflowModule,
    BodyDataModule,
  ],
  controllers: [AiTasksController],
  providers: [AiTasksService, AiGenerationProcessor],
})
export class AiTasksModule {}
