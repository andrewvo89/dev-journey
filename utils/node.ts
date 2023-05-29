import { DefaultMantineColor } from '@mantine/core';
import { JNodeType } from 'types/common';

export const jnodeTypeMap: Record<JNodeType, { label: string; color: DefaultMantineColor }> = {
  career: { label: 'Career', color: 'yellow' },
  concept: { label: 'Concept', color: 'green' },
  framework: { label: 'Framework', color: 'pink' },
  language: { label: 'Language', color: 'red' },
  library: { label: 'Library', color: 'violet' },
  meta_framework: { label: 'Meta Framework', color: 'grape' },
  methodology: { label: 'Methodology', color: 'cyan' },
  paradigm: { label: 'Paradigm', color: 'lime' },
  platform: { label: 'Platform', color: 'violet' },
  root: { label: 'Start of journey', color: 'blue' },
  tool: { label: 'Tool', color: 'teal' },
};
