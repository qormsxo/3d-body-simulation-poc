import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { BodyDataService } from '../body-data/body-data.service';
import { DesignWorkflowService } from '../design-workflow/design-workflow.service';
import { CreateAiTaskDto } from './dto/create-ai-task.dto';
import { AiTaskResponseDto } from './dto/ai-task-response.dto';
import { AiGenerationTask } from './entities/ai-generation-task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { AI_GENERATION_JOB, AI_GENERATION_QUEUE, AiGenerationJobData } from './queue/ai-generation.constants';

@Injectable()
export class AiTasksService {
  private readonly logger = new Logger(AiTasksService.name);

  constructor(
    @InjectRepository(AiGenerationTask)
    private readonly aiTaskRepository: Repository<AiGenerationTask>,
    @InjectQueue(AI_GENERATION_QUEUE) private readonly aiGenerationQueue: Queue<AiGenerationJobData>,
    private readonly designWorkflowService: DesignWorkflowService,
    private readonly bodyDataService: BodyDataService,
  ) {}

  async createAndEnqueue(dto: CreateAiTaskDto): Promise<AiTaskResponseDto> {
    const [workflowExists, bodyDataExists] = await Promise.all([
      this.designWorkflowService.existsById(dto.workflowId),
      this.bodyDataService.existsById(dto.bodyDataId),
    ]);

    if (!workflowExists) {
      throw new BadRequestException(`존재하지 않는 workflowId 입니다: ${dto.workflowId}`);
    }
    if (!bodyDataExists) {
      throw new BadRequestException(`존재하지 않는 bodyDataId 입니다: ${dto.bodyDataId}`);
    }

    const task = this.aiTaskRepository.create({
      workflowId: dto.workflowId,
      bodyDataId: dto.bodyDataId,
      prompt: dto.prompt,
      status: TaskStatus.PENDING,
    });
    const saved = await this.aiTaskRepository.save(task);

    await this.aiGenerationQueue.add(
      AI_GENERATION_JOB,
      { taskId: saved.id },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 1000,
        removeOnFail: false,
      },
    );

    this.logger.log(`AiGenerationTask ${saved.id} enqueued to ${AI_GENERATION_QUEUE}`);

    return { id: saved.id, status: saved.status, enqueued: true };
  }

  async findById(id: string): Promise<AiGenerationTask> {
    const task = await this.aiTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`AiGenerationTask를 찾을 수 없습니다: ${id}`);
    }
    return task;
  }

  save(task: AiGenerationTask): Promise<AiGenerationTask> {
    return this.aiTaskRepository.save(task);
  }
}
