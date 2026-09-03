import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WorkflowStatus } from '../enums/workflow-status.enum';

@Entity('design_workflow')
export class DesignWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * AI 노드 워크플로우의 노드/엣지 연결 정보(JSON)를 저장한다.
   * 예: { nodes: [...], edges: [...] }
   */
  @Column({ name: 'node_graph_json', type: 'json' })
  nodeGraphJson: Record<string, unknown>;

  @Column({ type: 'enum', enum: WorkflowStatus, default: WorkflowStatus.DRAFT })
  status: WorkflowStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
