import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DesignWorkflowService } from './design-workflow.service';
import { DesignWorkflow } from './entities/design-workflow.entity';

@ApiTags('design-workflow')
@Controller('api/design-workflows')
export class DesignWorkflowController {
  constructor(private readonly designWorkflowService: DesignWorkflowService) {}

  @Get()
  @ApiOperation({ summary: 'AI 노드 워크플로우 목록 조회 (테스트용 조회 편의 API)' })
  @ApiOkResponse({ type: [DesignWorkflow] })
  findAll(): Promise<DesignWorkflow[]> {
    return this.designWorkflowService.findAll();
  }
}
