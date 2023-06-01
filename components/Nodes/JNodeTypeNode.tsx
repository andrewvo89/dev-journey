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
import { useStyles } from 'styles/node';

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

  const { classes } = useStyles({ keepAlive, isOptional, isOnPath, type: jnode.type });

  const rocketButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    updateNodes([{ id, enabled: true }]);
  };

  const cardClickHandler = () => {
    if (!keepAlive) {
      return;
    }

    modals.open({
      classNames: {
        overlay: classes.overlay,
        inner: classes.inner,
      },
      size: 'xl',
      overlayProps: {
        color: theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      },
      title: <Title>{jnode.name}</Title>,
      closeButtonProps: {
        size: 'lg',
      },
      children: <ResourceModalContent description={jnode.description} resources={jnode.resources} />,
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
      <Paper className={[classes.paper, 'nodrag'].join(' ')} onClick={cardClickHandler}>
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
