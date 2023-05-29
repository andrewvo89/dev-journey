import { Group, Paper, Stack, Text, createStyles } from '@mantine/core';

import { JNodeType } from 'types/common';
import LegentListItem from 'components/LegendListItem';
import { useMemo } from 'react';
import { useNodeStore } from 'store/nodes';

const useStyles = createStyles((theme) => ({
  keyName: {
    whiteSpace: 'nowrap',
  },
  onPath: {
    // backgroundColor: `${theme.colors[props.color][5]}`,
    // opacity: isOptional ? 0.6 : keepAlive ? 1 : 0.2,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.blue[6],
    width: '1rem',
    height: '1rem',
  },
  futurePath: {
    // backgroundColor: `${theme.colors[props.color][5]}`,
    // opacity: isOptional ? 0.6 : keepAlive ? 1 : 0.2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.blue[6],
    width: '1rem',
    height: '1rem',
  },
  notOnPath: {
    // backgroundColor: `${theme.colors[props.color][5]}`,
    // opacity: isOptional ? 0.6 : keepAlive ? 1 : 0.2,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.gray[6],
    width: '1rem',
    height: '1rem',
    opacity: 0.2,
  },
}));

export function LegendList() {
  const nodes = useNodeStore((state) => state.nodes);
  const uniqueTypes = useMemo<Set<JNodeType>>(
    () => nodes.reduce((list, node) => list.add(node.data.jnode.type), new Set<JNodeType>()),
    [nodes],
  );
  const { classes } = useStyles();

  return (
    <Stack>
      <Group noWrap grow={false}>
        <Paper shadow='sm' className={classes.onPath}></Paper>
        <Text className={classes.keyName}>On path</Text>
      </Group>
      <Group noWrap grow={false}>
        <Paper shadow='sm' className={classes.notOnPath}></Paper>
        <Text className={classes.keyName}>Not on path</Text>
      </Group>
      <Group noWrap grow={false}>
        <Paper shadow='sm' className={classes.futurePath}></Paper>
        <Text className={classes.keyName}>Future path</Text>
      </Group>
      {Array.from(uniqueTypes).map((type) => (
        <LegentListItem key={type} type={type} />
      ))}
    </Stack>
  );
}
