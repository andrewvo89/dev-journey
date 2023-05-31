import { ActionIcon, Badge, Paper, Text, ThemeIcon, Title, createStyles, useMantineTheme } from '@mantine/core';
import { Fragment, useMemo } from 'react';
import { Handle, NodeProps } from 'reactflow';
import { IconCrown, IconRocket } from '@tabler/icons-react';
import { JNodeTypeData, jnodeProps } from 'types/flow';

import { JNodeType } from 'types/jnode';
import ResourceModalContent from 'components/ResourceModalContent';
import { jnodeTypeMap } from 'utils/node';
import { modals } from '@mantine/modals';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';

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
      opacity: isOptional ? 0.75 : keepAlive ? 1 : 0.2,
      borderWidth: 1,
      borderStyle: isOptional ? 'dashed' : 'solid',
      borderColor: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
      color: theme.colors.gray[0],
      backgroundColor: theme.colors[jnodeTypeMap[type].color][5],
      boxShadow: keepAlive ? theme.shadows.sm : undefined,
      transition: 'all .2s ease-in-out',
      ':hover': {
        boxShadow: keepAlive ? theme.shadows.xl : undefined,
        transform: keepAlive ? 'scale(1.1)' : undefined,
      },
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

export default function JNodeTypeNode(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { jnode, isOnPath, isOnOptionalPath, isLeafNode, noNodesOnPath, isDesNode },
    sourcePosition,
    targetPosition,
  } = props;

  const selected = useHistoryStore((state) => state.selected);
  const updateNodes = useNodeStore((state) => state.updateNodes);
  const theme = useMantineTheme();

  const isOptional = isOnOptionalPath && !isDesNode;
  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath || !selected;

  const { classes } = useStyles({
    keepAlive,
    isOptional,
    isOnPath,
    type: jnode.type,
  });

  const rocketButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    updateNodes([{ id, enabled: true }]);
  };

  const cardClickHandler = () => {
    if (!keepAlive) {
      return;
    }

    modals.open({
      size: 'xl',
      overlayProps: {
        color: theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      },
      title: <Title>{jnode.name}</Title>,
      closeButtonProps: {
        size: 'xl',
      },
      children: <ResourceModalContent resources={jnode.resources} />,
    });
  };

  const resourceCount = useMemo(
    () => Object.values(jnode.resources).reduce((count, resourceType) => count + resourceType.length, 0),
    [jnode.resources],
  );

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && jnode.dependencies.length > 0 && (
        <Handle type='target' position={targetPosition} className={classes.handle} />
      )}
      <Paper className={classes.paper} onClick={cardClickHandler}>
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
        {resourceCount > 0 && (
          <Badge className={classes.badge} size='lg'>
            {resourceCount}
          </Badge>
        )}
        <Text>{jnode.name}</Text>
      </Paper>
    </Fragment>
  );
}
