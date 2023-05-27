import { Badge, Paper, Text } from '@mantine/core';
import { Handle, NodeProps } from 'reactflow';

import { Fragment } from 'react';
import { JNodeTypeData } from 'types/flow';
import { useHistoryStore } from 'store/history';
import { useNodeStyles } from 'styles/node';

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { jnode, isOnPath, isLeafNode, noNodesOnPath, isOnOptionalPath },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);

  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath || !selected;

  const { classes } = useNodeStyles({
    keepAlive,
    isOptional: isOnOptionalPath && !isOnPath,
    isOnPath,
    type: jnode.type,
  });
  const isRoot = id === 'root';

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && !isRoot && <Handle type='target' position={targetPosition} className={classes.handle} />}
      <Paper shadow='sm' className={classes.paper}>
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
