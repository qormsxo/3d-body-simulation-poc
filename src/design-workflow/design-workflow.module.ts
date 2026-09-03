import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignWorkflowController } from './design-workflow.controller';
import { DesignWorkflowService } from './design-workflow.service';
import { DesignWorkflow } from './entities/design-workflow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DesignWorkflow])],
  controllers: [DesignWorkflowController],
  providers: [DesignWorkflowService],
  exports: [DesignWorkflowService],
})
export class DesignWorkflowModule {}
