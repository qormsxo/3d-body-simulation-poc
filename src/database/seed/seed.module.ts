import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyData } from '../../body-data/entities/body-data.entity';
import { DesignWorkflow } from '../../design-workflow/entities/design-workflow.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([BodyData, DesignWorkflow])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
