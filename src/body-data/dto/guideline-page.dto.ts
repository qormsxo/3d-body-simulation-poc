import { ApiProperty } from '@nestjs/swagger';
import { BodyData } from '../entities/body-data.entity';

export class GuidelinePageDto {
  @ApiProperty({ type: [BodyData] })
  items: BodyData[];

  @ApiProperty({ example: 150000 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: false, description: '결과가 캐시에서 조회되었는지 여부' })
  fromCache: boolean;
}
