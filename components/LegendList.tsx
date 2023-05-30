import { IconCrown, IconRocket } from '@tabler/icons-react';
import { Stack, createStyles } from '@mantine/core';

import { JNodeType } from 'types/common';
import { LegendBorderListItem } from 'components/LegendBorderListItem';
import { LegendIconListItem } from 'components/LegendIconListItem';
import LegendTypeListItem from 'components/LegendTypeListItem';
import { useMemo } from 'react';
import { useNodeStore } from 'store/nodes';

const useStyles = createStyles((theme) => ({
  keyName: {
    whiteSpace: 'nowrap',
  },
  borderLegend: {
    borderWidth: 1,
    width: '1rem',
    height: '1rem',
  },
  onPath: {
    borderColor: theme.colors.blue[6],
    borderStyle: 'solid',
  },
  extendedPath: {
    borderStyle: 'dashed',
    borderColor: theme.colors.blue[6],
  },
  notOnPath: {
    borderStyle: 'solid',
    borderColor: theme.colors.gray[6],
    opacity: 0.2,
  },
}));

const iconLegends: { name: string; icon: JSX.Element }[] = [
  { name: 'Destination', icon: <IconCrown /> },
  { name: 'Next step', icon: <IconRocket /> },
];

const borderLegends: { name: string; paperClassName: 'onPath' | 'notOnPath' | 'extendedPath' }[] = [
  { name: 'On path', paperClassName: 'onPath' },
  { name: 'Not on path', paperClassName: 'notOnPath' },
  { name: 'Extended path', paperClassName: 'extendedPath' },
];

const typesOrder: Record<JNodeType, number> = {
  root: 0,
  tool: 1,
  language: 2,
  database: 3,
  framework: 4,
  meta_framework: 5,
  software: 6,
  library: 7,
  platform: 8,
  paradigm: 9,
  field: 10,
  career: 11,
};

export function LegendList() {
  const nodes = useNodeStore((state) => state.nodes);
  const uniqueTypes = useMemo<Set<JNodeType>>(
    () => nodes.reduce((list, node) => list.add(node.data.jnode.type), new Set<JNodeType>()),
    [nodes],
  );
  const { classes } = useStyles();

  return (
    <Stack>
      {iconLegends.map((legend) => (
        <LegendIconListItem
          key={legend.name}
          classNames={{ text: classes.keyName }}
          icon={legend.icon}
          name={legend.name}
        />
      ))}
      {borderLegends.map((legend) => (
        <LegendBorderListItem
          key={legend.name}
          name={legend.name}
          classNames={{ text: classes.keyName, paper: `${classes.borderLegend} ${classes[legend.paperClassName]}` }}
        />
      ))}
      {Array.from(uniqueTypes)
        .sort((a, b) => typesOrder[a] - typesOrder[b])
        .map((type) => (
          <LegendTypeListItem key={type} type={type} />
        ))}
    </Stack>
  );
}