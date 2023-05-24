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
}));

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    data: { label, isOnPath, isLeafNode, noNodesOnPath },
    sourcePosition,
    targetPosition,
  } = props;
  const { classes } = useStyles({ isOnPath, noNodesOnPath });
  console.log('noNodesOnPath', noNodesOnPath);

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} style={{ color: 'red' }} />}
      {targetPosition && <Handle type='target' position={targetPosition} />}
      <Paper shadow='sm' className={classes.paper} withBorder>
        <Text>{label}</Text>
      </Paper>
    </Fragment>
  );
}
