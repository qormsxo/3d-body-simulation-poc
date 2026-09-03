import { WorkflowStatus } from '../../design-workflow/enums/workflow-status.enum';

export const DESIGN_WORKFLOW_SAMPLES = [
  {
    title: '기본 티셔츠 생성 워크플로우',
    status: WorkflowStatus.PUBLISHED,
    nodeGraphJson: {
      nodes: [
        { id: 'input-body', type: 'BodyDataInput', position: { x: 0, y: 0 } },
        { id: 'prompt', type: 'PromptInput', position: { x: 0, y: 150 } },
        { id: 'style-transfer', type: 'StyleTransfer', position: { x: 250, y: 75 } },
        { id: 'render', type: 'RenderOutput', position: { x: 500, y: 75 } },
      ],
      edges: [
        { from: 'input-body', to: 'style-transfer' },
        { from: 'prompt', to: 'style-transfer' },
        { from: 'style-transfer', to: 'render' },
      ],
    },
  },
  {
    title: '아웃도어 재킷 디자인 워크플로우',
    status: WorkflowStatus.PUBLISHED,
    nodeGraphJson: {
      nodes: [
        { id: 'input-body', type: 'BodyDataInput', position: { x: 0, y: 0 } },
        { id: 'prompt', type: 'PromptInput', position: { x: 0, y: 150 } },
        { id: 'fit-analysis', type: 'FitAnalysis', position: { x: 220, y: 0 } },
        { id: 'style-transfer', type: 'StyleTransfer', position: { x: 440, y: 75 } },
        { id: 'texture', type: 'TextureSynthesis', position: { x: 660, y: 75 } },
        { id: 'render', type: 'RenderOutput', position: { x: 880, y: 75 } },
      ],
      edges: [
        { from: 'input-body', to: 'fit-analysis' },
        { from: 'fit-analysis', to: 'style-transfer' },
        { from: 'prompt', to: 'style-transfer' },
        { from: 'style-transfer', to: 'texture' },
        { from: 'texture', to: 'render' },
      ],
    },
  },
  {
    title: '실험용 드레스 워크플로우 (초안)',
    status: WorkflowStatus.DRAFT,
    nodeGraphJson: {
      nodes: [
        { id: 'input-body', type: 'BodyDataInput', position: { x: 0, y: 0 } },
        { id: 'prompt', type: 'PromptInput', position: { x: 0, y: 150 } },
        { id: 'style-transfer', type: 'StyleTransfer', position: { x: 250, y: 75 } },
      ],
      edges: [
        { from: 'input-body', to: 'style-transfer' },
        { from: 'prompt', to: 'style-transfer' },
      ],
    },
  },
];
