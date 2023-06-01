import { Handle, NodeProps } from 'reactflow';
import { Paper, Text } from '@mantine/core';

import { Fragment } from 'react';
import { JNodeTypeData } from 'types/flow';
import { useInputRefStore } from 'store/input-ref';
import { useStyles } from 'styles/node';

export default function RootNode(props: NodeProps<JNodeTypeData>) {
  const {
    data: { jnode },
    sourcePosition,
  } = props;
  const inputRef = useInputRefStore((state) => state.inputRef);

  const { classes } = useStyles({ keepAlive: true, isOptional: false, isOnPath: true, type: 'root' });

  const cardClickHandler = () => {
    if (!inputRef) {
      return;
    }
    inputRef.focus();
  };

  return (
    <Fragment>
      {sourcePosition && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      <Paper className={[classes.paper, 'nodrag'].join(' ')} onClick={cardClickHandler}>
        <Text>{jnode.name}</Text>
      </Paper>
    </Fragment>
  );
}
