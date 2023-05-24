import { Handle, NodeProps } from 'reactflow';
import { JNodeTypeData, jnodeProps } from 'types/flow';
import { Paper, Text, createStyles } from '@mantine/core';

import { Fragment } from 'react';
import { useHistoryStore } from 'store/history';

type StyleProps = {
  fadeNode: boolean;
};

const useStyles = createStyles((_, { fadeNode }: StyleProps) => ({
  paper: {
    width: jnodeProps.dimensions.width,
    height: jnodeProps.dimensions.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: fadeNode ? 0.2 : 1,
  },
  handle: {
    opacity: fadeNode ? 0.2 : 1,
  },
}));

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { label, isOnPath, isLeafNode, noNodesOnPath },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);
  const fadeNode = (!isOnPath && !noNodesOnPath) || (noNodesOnPath && !!selected);
  const { classes } = useStyles({ fadeNode });
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
