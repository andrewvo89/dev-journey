import { JNode } from 'types/common';
import { MantineTheme } from '@mantine/core';

export function getNodeColor(type: JNode['type'], theme: MantineTheme): string {
  switch (type) {
    case 'root':
      return theme.colors.blue[5];
    case 'language':
      return theme.colors.red[5];
    case 'framework':
      return theme.colors.pink[5];
    case 'meta_framework':
      return theme.colors.grape[5];
    case 'library':
      return theme.colors.violet[5];
    case 'platform':
      return theme.colors.indigo[5];
    case 'methodology':
      return theme.colors.cyan[5];
    case 'tool':
      return theme.colors.teal[5];
    case 'concept':
      return theme.colors.green[5];
    case 'paradigm':
      return theme.colors.lime[5];
    case 'career':
      return theme.colors.yellow[5];
    case 'other':
      return theme.colors.gray[5];
    case 'goal':
      return theme.colors.orange[5];
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}
