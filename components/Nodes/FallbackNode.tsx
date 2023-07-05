import { Badge, Menu, Paper, Text, ThemeIcon, createStyles, useMantineTheme } from '@mantine/core';
import { Fragment, MouseEvent } from 'react';
import { Handle, NodeProps } from 'reactflow';
import { IconBook, IconFileDescription, IconFlag, IconRocket } from '@tabler/icons-react';

import { JNodeTypeData } from 'types/flow';
import ResourceModalContent from 'components/ResourceModalContent';
import { modals } from '@mantine/modals';
import { shallow } from 'zustand/shallow';
import { useContextMenuStore } from 'store/context-menu';
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

  const updateNodes = useNodeStore((state) => state.updateNodes);
  const theme = useMantineTheme();
  const setSelected = useHistoryStore((state) => state.setSelected);
  const { isOpened, setIsOpened } = useContextMenuStore(
    (state) => ({ isOpened: state.isOpened, setIsOpened: state.setIsOpened }),
    shallow,
  );

  const isOptional = isOnOptionalPath && !isDesNode;
  const keepAlive = isOnPath || isOnOptionalPath || noNodesOnPath;

  const { classes } = useStyles({ keepAlive, isOptional, isOnPath, type: jnode.type });
  const { classes: modalClasses } = useModalStyles();

  const goToNodeClickHandler = () => {
    updateNodes([{ id, enabled: true }]);
    setSelected(null);
  };

  const cardClickHandler = () => {
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

  const cardRightClickHandler = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setIsOpened(jnode.id);
  };

  const menuChangeHandler = (opened: boolean) => {
    if (opened) {
      return;
    }
    setIsOpened(null);
  };

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && jnode.dependencies.length > 0 && (
        <Handle type='target' position={targetPosition} className={classes.handle} />
      )}
      <Menu shadow='md' trigger='click' withinPortal opened={isOpened === jnode.id} onChange={menuChangeHandler}>
        <Menu.Target>
          <Paper
            className={[classes.paper, 'nodrag'].join(' ')}
            onClick={cardClickHandler}
            onContextMenu={cardRightClickHandler}
          >
            {isDesNode && (
              <ThemeIcon className={classes.crownIcon}>
                <IconFlag />
              </ThemeIcon>
            )}
            {isOnOptionalPath && !isDesNode && (
              <ThemeIcon variant='filled' color='blue' className={classes.rocketIcon}>
                <IconRocket />
              </ThemeIcon>
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
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{jnode.title}</Menu.Label>
          <Menu.Divider />
          <Menu.Item icon={<IconRocket size={14} />} onClick={goToNodeClickHandler}>
            Go to node
          </Menu.Item>
          <Menu.Item
            icon={jnode.resources > 0 ? <IconBook size={14} /> : <IconFileDescription size={14} />}
            onClick={cardClickHandler}
          >
            View {jnode.resources > 0 ? 'resources' : 'description'}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Fragment>
  );
}
