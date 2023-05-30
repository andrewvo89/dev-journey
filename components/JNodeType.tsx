import { ActionIcon, Badge, Paper, Text, ThemeIcon, createStyles } from '@mantine/core';
import { Handle, NodeProps } from 'reactflow';
import { IconCrown, IconRocket } from '@tabler/icons-react';
import { JNodeTypeData, jnodeProps } from 'types/flow';

import { Fragment } from 'react';
import { JNodeType } from 'types/common';
import { jnodeTypeMap } from 'utils/node';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/nodes';

type StyleProps = {
  type: JNodeType;
  keepAlive: boolean;
  isOptional: boolean;
  isOnPath: boolean;
};

export const useStyles = createStyles((theme, props: StyleProps) => {
  const { keepAlive, isOptional, isOnPath, type } = props;

  return {
    paper: {
      width: jnodeProps.dimensions.width,
      height: jnodeProps.dimensions.height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isOptional ? 0.6 : keepAlive ? 1 : 0.2,
      borderWidth: 1,
      borderStyle: isOptional ? 'dashed' : 'solid',
      borderColor: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
      color: theme.colors.gray[0],
      backgroundColor: theme.colors[jnodeTypeMap[type].color][5],
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
      color: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
      backgroundColor: theme.white,
      zIndex: 1,
    },
    crownIcon: {
      width: '2rem',
      height: '2rem',
      position: 'absolute',
      left: '-1rem',
    },
    rocketIcon: {
      width: '2rem',
      height: '2rem',
      position: 'absolute',
      left: '-1rem',
    },
  };
});

export default function JNodeType(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { jnode, isOnPath, isOnOptionalPath, isLeafNode, noNodesOnPath, isDesNode },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);
  const updateNodes = useNodeStore((state) => state.updateNodes);

  const isOptional = isOnOptionalPath && !isDesNode;
  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath || !selected;

  const { classes } = useStyles({
    keepAlive,
    isOptional,
    isOnPath,
    type: jnode.type,
  });

  const rocketButtonClickHandler = () => {
    updateNodes([{ id, enabled: true }]);
  };

  // generate a number between 1 an 100
  const random = Math.floor(Math.random() * 100) + 1;

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
        {isOnOptionalPath && !isDesNode && (
          <ActionIcon variant='filled' color='blue' className={classes.rocketIcon} onClick={rocketButtonClickHandler}>
            <IconRocket />
          </ActionIcon>
        )}
        {/* {jnode.resources.length > 0 && (
          <Badge className={classes.badge} size='lg'>
            {jnode.resources.length}
          </Badge>
        )} */}
        <Badge className={classes.badge} size='lg'>
          {random}
        </Badge>
        <Text>{jnode.name}</Text>
      </Paper>
    </Fragment>
  );
}
