import { Badge, Paper, Text, createStyles } from '@mantine/core';
import { Handle, NodeProps } from 'reactflow';
import { JNodeTypeData, jnodeProps } from 'types/flow';

import { Fragment } from 'react';
import { useHistoryStore } from 'store/history';

type StyleProps = {
  keepAlive: boolean;
  isOptional: boolean;
  isOnPath: boolean;
};

const useStyles = createStyles((theme, { keepAlive, isOptional, isOnPath }: StyleProps) => ({
  paper: {
    width: jnodeProps.dimensions.width,
    height: jnodeProps.dimensions.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: keepAlive ? 1 : 0.2,
    borderWidth: 1,
    borderStyle: isOptional ? 'dashed' : 'solid',
    borderColor: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
    color: theme.colors.gray[isOptional ? 6 : 7],
  },
  handle: {
    '&&': {
      opacity: keepAlive ? 1 : 0.1,
      backgroundColor: isOnPath ? theme.colors.blue[6] : theme.colors.gray[6],
    },
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    border: `1px solid ${isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6]}`,
    color: theme.colors.gray[isOptional ? 6 : 7],
    backgroundColor: theme.white,
  },
}));

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { jnode, isOnPath, isLeafNode, noNodesOnPath, isOnOptionalPath },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);

  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath || !selected;

  const { classes } = useStyles({
    keepAlive,
    isOptional: isOnOptionalPath && !isOnPath,
    isOnPath,
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
