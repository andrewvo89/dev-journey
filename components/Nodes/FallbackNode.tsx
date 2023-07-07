import { Badge, Menu, Paper, Text, ThemeIcon, useMantineTheme } from '@mantine/core';
import { Fragment, MouseEvent } from 'react';
import { Handle, NodeProps } from 'reactflow';
import { IconBook, IconBookmarkPlus, IconFileDescription, IconFlag, IconRocket } from '@tabler/icons-react';

import { JNodeTypeData } from 'types/flow';
import ResourceModalContent from 'components/ResourceModalContent';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useBookmarkStore } from 'store/bookmark';
import { useGraphCtxMenuStore } from 'store/graph-context-menu';
import { useHistoryStore } from 'store/history';
import { useModalStyles } from 'styles/modal';
import { useNodeStore } from 'store/node';
import { useStyles } from 'styles/node';
import { useTabStore } from 'store/tab';

export default function FallbackNode(props: NodeProps<JNodeTypeData>) {
  const {
    id,
    data: { jnode, isOnPath, isOnOptionalPath, isLeafNode, noNodesOnPath, isDesNode },
    sourcePosition,
    targetPosition,
  } = props;

  const updateNodes = useNodeStore((state) => state.updateNodes);
  const theme = useMantineTheme();
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const setTab = useTabStore((state) => state.setTab);
  const setSelected = useHistoryStore((state) => state.setSelected);
  const { menuIsOpen, setMenuIsOpen } = useGraphCtxMenuStore();

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
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h1 },
      size: 'xl',
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 3 },
      closeButtonProps: { size: 'lg' },
      title: jnode.title,
      children: <ResourceModalContent jnodeShallow={jnode} />,
    });
  };

  const cardRightClickHandler = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setMenuIsOpen(jnode.id);
  };

  const menuChangeHandler = (opened: boolean) => {
    if (opened) {
      return;
    }
    setMenuIsOpen(null);
  };

  const bookmarkClickHandler = () => {
    addBookmark({ id: jnode.id, type: 'destination', jnode });
    setTab('bookmarks');
    notifications.show({ title: 'Added bookmark', message: jnode.title, icon: <IconBookmarkPlus /> });
  };

  return (
    <Fragment>
      {sourcePosition && !isLeafNode && <Handle type='source' position={sourcePosition} className={classes.handle} />}
      {targetPosition && jnode.dependencies.length > 0 && (
        <Handle type='target' position={targetPosition} className={classes.handle} />
      )}
      <Menu shadow='md' trigger='click' withinPortal opened={menuIsOpen === jnode.id} onChange={menuChangeHandler}>
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
          <Menu.Item icon={<IconRocket size={14} />} onClick={goToNodeClickHandler}>
            Go to destination
          </Menu.Item>
          <Menu.Item
            icon={jnode.resources > 0 ? <IconBook size={14} /> : <IconFileDescription size={14} />}
            onClick={cardClickHandler}
          >
            View {jnode.resources > 0 ? 'resources' : 'description'}
          </Menu.Item>
          <Menu.Item icon={<IconBookmarkPlus size={14} />} onClick={bookmarkClickHandler}>
            Add to bookmarks
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Fragment>
  );
}
