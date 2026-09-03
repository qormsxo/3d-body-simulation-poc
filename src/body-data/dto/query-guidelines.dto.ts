import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { GuidelineCategory } from '../enums/guideline-category.enum';

export class QueryGuidelinesDto {
  @ApiPropertyOptional({ enum: Gender, description: '성별 필터' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: GuidelineCategory, description: '체형 가이드라인 카테고리 필터' })
  @IsOptional()
  @IsEnum(GuidelineCategory)
  guidelineCategory?: GuidelineCategory;

  @ApiPropertyOptional({ description: '최소 키(cm)', example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minHeight?: number;

  @ApiPropertyOptional({ description: '최대 키(cm)', example: 190 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxHeight?: number;

  @ApiPropertyOptional({ description: '최소 몸무게(kg)', example: 45 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minWeight?: number;

  @ApiPropertyOptional({ description: '최대 몸무게(kg)', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxWeight?: number;

  @ApiPropertyOptional({ description: '페이지 번호 (1부터 시작)', default: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: '페이지당 결과 수', default: 20, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
