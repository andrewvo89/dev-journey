import { DefaultMantineColor } from '@mantine/core';
import { JNodeType } from 'types/jnode';

export const jnodeTypeMap: Record<JNodeType, { label: string; color: DefaultMantineColor }> = {
  root: { label: 'Start of journey', color: 'blue' },
  language: { label: 'Language', color: 'red' },
  database: { label: 'Database', color: 'cyan' },
  tool: { label: 'Tool', color: 'teal' },
  library: { label: 'Library', color: 'violet' },
  framework: { label: 'Framework', color: 'pink' },
  meta_framework: { label: 'Meta Framework', color: 'grape' },
  software: { label: 'Software', color: 'orange' },
  paradigm: { label: 'Paradigm', color: 'lime' },
  platform: { label: 'Platform', color: 'green' },
  field: { label: 'Field', color: 'indigo' },
  career: { label: 'Career', color: 'yellow' },
};
