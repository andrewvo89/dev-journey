import { IconFlag, IconRocket } from '@tabler/icons-react';
import { Stack, createStyles } from '@mantine/core';

import { JnodeType } from 'types/jnode';
import { LegendBorderListItem } from 'components/LeftPanel/LegendBorderListItem';
import { LegendIconListItem } from 'components/LeftPanel/LegendIconListItem';
import LegendTypeListItem from 'components/LeftPanel/LegendTypeListItem';
import { useMemo } from 'react';
import { useNodeStore } from 'store/node';

const useStyles = createStyles(() => ({
  container: {
    padding: '0.5rem 0',
    gap: 0,
  },
}));

const iconKeys: { name: string; icon: JSX.Element }[] = [
  { name: 'Destination', icon: <IconFlag /> },
  { name: 'Next step', icon: <IconRocket /> },
];

const borderKeys: { name: string; paperClassName: 'onPath' | 'notOnPath' | 'extendedPath' }[] = [
  { name: 'On path', paperClassName: 'onPath' },
  { name: 'Not on path', paperClassName: 'notOnPath' },
  { name: 'Extended path', paperClassName: 'extendedPath' },
];

const typesOrder: JnodeType[] = [
  'root',
  'tool',
  'runtime',
  'language',
  'database',
  'framework',
  'library',
  'platform',
  'paradigm',
  'field',
];

export function LegendList() {
  const nodes = useNodeStore((state) => state.nodes);
  const uniqueTypes = useMemo<Set<JnodeType>>(
    () => nodes.reduce((list, node) => list.add(node.data.jnode.type), new Set<JnodeType>()),
    [nodes],
  );
  const { classes } = useStyles();

  return (
    <Stack className={classes.container}>
      {iconKeys.map((key) => (
        <LegendIconListItem key={key.name} icon={key.icon} name={key.name} />
      ))}
      {borderKeys.map((key) => (
        <LegendBorderListItem key={key.name} name={key.name} paperClassName={key.paperClassName} />
      ))}
      {Array.from(uniqueTypes)
        .sort((a, b) => typesOrder.indexOf(a) - typesOrder.indexOf(b))
        .map((type) => (
          <LegendTypeListItem key={type} type={type} />
        ))}
    </Stack>
  );
}
