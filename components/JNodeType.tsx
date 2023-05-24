import { Handle, NodeProps } from 'reactflow';
import { JNodeTypeData, jnodeProps } from 'types/flow';
import { Paper, Text, createStyles } from '@mantine/core';

import { Fragment } from 'react';

type StyleProps = {
  isOnPath: boolean;
  noNodesOnPath: boolean;
};

const useStyles = createStyles((_, { isOnPath, noNodesOnPath }: StyleProps) => ({
  paper: {
    width: jnodeProps.dimensions.width,
    height: jnodeProps.dimensions.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isOnPath || noNodesOnPath ? 1 : 0.2,
  },
  handle: {
    opacity: isOnPath || noNodesOnPath ? 1 : 0.2,
  },
}));

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { label, isOnPath, isLeafNode, noNodesOnPath },
    sourcePosition,
    targetPosition,
  } = props;
  const { classes } = useStyles({ isOnPath, noNodesOnPath });
  const isRoot = id === 'root';

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && !isRoot && <Handle type='target' position={targetPosition} className={classes.handle} />}
      <Paper shadow='sm' className={classes.paper} withBorder>
        <Text>{label}</Text>
      </Paper>
    </Fragment>
  );
}
