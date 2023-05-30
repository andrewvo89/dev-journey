import { Badge, Paper, Text, ThemeIcon } from '@mantine/core';
import { Handle, NodeProps } from 'reactflow';
import { IconCrown, IconRocket } from '@tabler/icons-react';

import { Fragment } from 'react';
import { JNodeTypeData } from 'types/flow';
import { useHistoryStore } from 'store/history';
import { useNodeStyles } from 'styles/node';

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    data: { jnode, isOnPath, isOnOptionalPath, isLeafNode, noNodesOnPath, isDesNode },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);

  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath || !selected;

  const { classes } = useNodeStyles({
    keepAlive,
    isOptional: isOnOptionalPath,
    isOnPath,
    type: jnode.type,
  });

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && jnode.dependencies.length > 0 && (
        <Handle type='target' position={targetPosition} className={classes.handle} />
      )}
      <Paper shadow='sm' className={`${classes.paper} nodrag`}>
        {isDesNode && (
          <ThemeIcon className={classes.crownIcon}>
            <IconCrown />
          </ThemeIcon>
        )}
        {isOnOptionalPath && (
          <ThemeIcon className={classes.forkIcon}>
            <IconRocket />
          </ThemeIcon>
        )}
        {jnode.resources.length > 0 && (
          <Badge className={classes.badge} size='lg'>
            {jnode.resources.length}
          </Badge>
        )}
        <Text>{jnode.name}</Text>
      </Paper>
    </Fragment>
  );
}
