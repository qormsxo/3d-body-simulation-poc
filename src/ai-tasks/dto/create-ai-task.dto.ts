import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAiTaskDto {
  @ApiProperty({ description: 'AI 디자인 생성에 사용할 노드 워크플로우 ID', format: 'uuid' })
  @IsUUID()
  workflowId: string;

  @ApiProperty({ description: '생성 기준이 되는 3D 인체 데이터 ID', format: 'uuid' })
  @IsUUID()
  bodyDataId: string;

  @ApiProperty({
    description: 'AI 디자인 생성을 위한 프롬프트',
    example: '미니멀한 스트릿 캐주얼 스타일의 후드 집업',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  prompt: string;
}
