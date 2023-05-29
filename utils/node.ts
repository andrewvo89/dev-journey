import { DefaultMantineColor } from '@mantine/core';
import { JNodeType } from 'types/common';

export const jnodeTypeMap: Record<JNodeType, { label: string; color: DefaultMantineColor }> = {
  root: { label: 'Start of journey', color: 'blue' },
  language: { label: 'Language', color: 'red' },
  tool: { label: 'Tool', color: 'teal' },
  library: { label: 'Library', color: 'violet' },
  framework: { label: 'Framework', color: 'pink' },
  meta_framework: { label: 'Meta Framework', color: 'grape' },
  software: { label: 'Software', color: 'orange' },
  methodology: { label: 'Methodology', color: 'cyan' },
  concept: { label: 'Concept', color: 'green' },
  paradigm: { label: 'Paradigm', color: 'lime' },
  platform: { label: 'Platform', color: 'violet' },
  career: { label: 'Career', color: 'yellow' },
};
