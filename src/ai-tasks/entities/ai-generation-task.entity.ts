import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum';

@Entity('ai_generation_task')
@Index(['status'])
export class AiGenerationTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workflow_id', type: 'uuid' })
  workflowId: string;

  @Column({ name: 'body_data_id', type: 'uuid' })
  bodyDataId: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ name: 'result_image_url', type: 'varchar', length: 512, nullable: true })
  resultImageUrl: string | null;

  @Column({ name: 'error_reason', type: 'text', nullable: true })
  errorReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date | null;
}
