import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiTasksService } from '../ai-tasks.service';
import { TaskStatus } from '../enums/task-status.enum';
import { AI_GENERATION_QUEUE, AiGenerationJobData } from './ai-generation.constants';

const SIMULATED_AI_COMPUTE_DELAY_MS = 3000;

/**
 * 'ai-generation-queue' 워커.
 * 실제 AI 모델 연산 대신 가상 delay(3초)로 연산 시간을 시뮬레이션한다.
 */
@Processor(AI_GENERATION_QUEUE)
export class AiGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(AiGenerationProcessor.name);

  constructor(private readonly aiTasksService: AiTasksService) {
    super();
  }

  async process(job: Job<AiGenerationJobData>): Promise<void> {
    const { taskId } = job.data;
    this.logger.log(`[${job.id}] AI 생성 작업 시작: taskId=${taskId}`);

    const task = await this.aiTasksService.findById(taskId);

    task.status = TaskStatus.PROCESSING;
    await this.aiTasksService.save(task);

    try {
      await this.simulateAiModelComputation();

      task.status = TaskStatus.COMPLETED;
      task.resultImageUrl = `https://cdn.doodll.comfolabs.io/generated/${taskId}.png`;
      task.completedAt = new Date();
      await this.aiTasksService.save(task);

      this.logger.log(`[${job.id}] AI 생성 작업 완료: taskId=${taskId}`);
    } catch (error) {
      task.status = TaskStatus.FAILED;
      task.errorReason = error instanceof Error ? error.message : 'Unknown error';
      await this.aiTasksService.save(task);
      throw error;
    }
  }

  private simulateAiModelComputation(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, SIMULATED_AI_COMPUTE_DELAY_MS));
  }
}
