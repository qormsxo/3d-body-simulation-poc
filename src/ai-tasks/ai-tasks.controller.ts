import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiTasksService } from './ai-tasks.service';
import { AiTaskResponseDto } from './dto/ai-task-response.dto';
import { CreateAiTaskDto } from './dto/create-ai-task.dto';
import { AiGenerationTask } from './entities/ai-generation-task.entity';

@ApiTags('ai-tasks')
@Controller('api/ai-tasks')
export class AiTasksController {
  constructor(private readonly aiTasksService: AiTasksService) {}

  @Post('generate')
  @ApiOperation({
    summary: '노드 기반 AI 디자인 생성 요청',
    description:
      'DesignWorkflow/BodyData 유효성 검증 후 AiGenerationTask를 PENDING 상태로 생성하고, ai-generation-queue에 작업을 enqueue한 뒤 즉시 Task ID를 응답한다.',
  })
  @ApiCreatedResponse({ type: AiTaskResponseDto })
  async generate(@Body() dto: CreateAiTaskDto): Promise<AiTaskResponseDto> {
    return this.aiTasksService.createAndEnqueue(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'AI 생성 작업 상태 조회 (테스트/폴링용 편의 API)' })
  @ApiOkResponse({ type: AiGenerationTask })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AiGenerationTask> {
    return this.aiTasksService.findById(id);
  }
}
