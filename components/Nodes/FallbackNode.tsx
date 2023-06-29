import { ActionIcon, Badge, Paper, Text, ThemeIcon, createStyles, useMantineTheme } from '@mantine/core';
import { Handle, NodeProps } from 'reactflow';
import { IconCrown, IconRocket } from '@tabler/icons-react';

import { Fragment } from 'react';
import { JNodeTypeData } from 'types/flow';
import ResourceModalContent from 'components/ResourceModalContent';
import { modals } from '@mantine/modals';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';
import { useStyles } from 'styles/node';

const useModalStyles = createStyles((theme) => ({
  overlay: {
    zIndex: 1001,
  },
  inner: {
    zIndex: 1002,
  },
  title: {
    fontSize: theme.headings.sizes.h1.fontSize,
    fontWeight: 700,
    lineHeight: theme.headings.sizes.h1.lineHeight,
  },
}));

export default function FallbackNode(props: NodeProps<JNodeTypeData>) {
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
  const { classes: modalClasses } = useModalStyles();

  const rocketButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    updateNodes([{ id, enabled: true }]);
  };

  const cardClickHandler = () => {
    if (!keepAlive) {
      return;
    }

    modals.open({
      modalId: jnode.id,
      classNames: {
        overlay: modalClasses.overlay,
        inner: modalClasses.inner,
        title: modalClasses.title,
      },
      size: 'xl',
      overlayProps: {
        color: theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      },
      closeButtonProps: {
        size: 'lg',
      },
      title: jnode.title,
      children: <ResourceModalContent jnodeShallow={jnode} />,
    });
  };

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
        {jnode.resources > 0 && (
          <Badge className={classes.badge} size='lg'>
            {jnode.resources}
          </Badge>
        )}
        <Text align='center' lh='1.25'>
          {jnode.title}
        </Text>
      </Paper>
    </Fragment>
  );
}
