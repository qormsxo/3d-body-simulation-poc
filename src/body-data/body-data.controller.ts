import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyDataService } from './body-data.service';
import { GuidelinePageDto } from './dto/guideline-page.dto';
import { QueryGuidelinesDto } from './dto/query-guidelines.dto';

@ApiTags('body-data')
@Controller('api/body-data')
export class BodyDataController {
  constructor(private readonly bodyDataService: BodyDataService) {}

  @Get('guidelines')
  @ApiOperation({
    summary: '3D 인체 데이터 가이드라인 조건 검색',
    description:
      '15만 건 이상의 3D 인체 데이터 중 조건에 맞는 가이드라인을 조회한다. Redis Look-Aside 캐싱이 적용되어 동일 조건 반복 조회 시 DB 접근을 방지한다.',
  })
  @ApiOkResponse({ type: GuidelinePageDto })
  async getGuidelines(@Query() query: QueryGuidelinesDto): Promise<GuidelinePageDto> {
    return this.bodyDataService.findGuidelines(query);
  }
}
