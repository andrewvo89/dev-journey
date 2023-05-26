import { Handle, NodeProps } from 'reactflow';
import { JNodeTypeData, jnodeProps } from 'types/flow';
import { Paper, Text, createStyles } from '@mantine/core';

import { Fragment } from 'react';
import { useHistoryStore } from 'store/history';

type StyleProps = {
  keepAlive: boolean;
  isOptional: boolean;
  isGoalNode: boolean;
};

const useStyles = createStyles((theme, { keepAlive, isOptional, isGoalNode }: StyleProps) => ({
  paper: {
    width: jnodeProps.dimensions.width,
    height: jnodeProps.dimensions.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: keepAlive ? 1 : 0.2,
    borderWidth: 1,
    borderStyle: isOptional ? 'dashed' : 'solid',
    borderColor: isGoalNode || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
    color: theme.colors.gray[isOptional ? 6 : 7],
  },
  handle: {
    opacity: keepAlive ? 1 : 0.1,
  },
}));

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { label, isOnPath, isLeafNode, noNodesOnPath, isOnOptionalPath, isGoalNode },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);

  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath || !selected;

  const { classes } = useStyles({
    keepAlive,
    isOptional: isOnOptionalPath && !isOnPath,
    isGoalNode: isGoalNode && !noNodesOnPath,
  });
  const isRoot = id === 'root';

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && !isRoot && <Handle type='target' position={targetPosition} className={classes.handle} />}
      <Paper shadow='sm' className={classes.paper}>
        <Text>{label}</Text>
      </Paper>
    </Fragment>
  );
}
