import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignWorkflow } from './entities/design-workflow.entity';

@Injectable()
export class DesignWorkflowService {
  constructor(
    @InjectRepository(DesignWorkflow)
    private readonly designWorkflowRepository: Repository<DesignWorkflow>,
  ) {}

  findAll(): Promise<DesignWorkflow[]> {
    return this.designWorkflowRepository.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<DesignWorkflow | null> {
    return this.designWorkflowRepository.findOne({ where: { id } });
  }

  async existsById(id: string): Promise<boolean> {
    return this.designWorkflowRepository.exist({ where: { id } });
  }

  count(): Promise<number> {
    return this.designWorkflowRepository.count();
  }
}
