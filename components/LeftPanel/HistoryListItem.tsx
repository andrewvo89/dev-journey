import {
  ActionIcon,
  Group,
  Menu,
  NavLink,
  Stack,
  Switch,
  Text,
  Tooltip,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { IconBookmarkPlus, IconCheck, IconTrashX, IconX } from '@tabler/icons-react';

import { Journey } from 'types/journey';
import dayjs from 'dayjs';
import { generateId } from 'utils/bookmark';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import relativeTime from 'dayjs/plugin/relativeTime';
import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from 'store/bookmark';
import { useHistoryCtxMenuStore } from 'store/history-context-menu';
import { useHistoryStore } from 'store/history';
import { useModalStore } from 'store/modal';
import { useModalStyles } from 'styles/modal';
import { useNodeStore } from 'store/node';
import { useTabStore } from 'store/tab';

dayjs.extend(relativeTime);

type Props = {
  journey: Journey;
};

const useStyles = createStyles(() => ({
  listItemChildren: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  listItemRoot: {
    borderRadius: 8,
  },
  switchContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
}));

export default function HistoryListItem(props: Props) {
  const { journey } = props;
  const { isOpen: menuIsOpen, setIsOpen: setMenuIsOpen } = useHistoryCtxMenuStore();
  const setTab = useTabStore((state) => state.setTab);

  const { selected, setSelected, removeJourney, selectPath, deselectPath, clearHistory } = useHistoryStore(
    (state) => ({
      selected: state.selected,
      setSelected: state.setSelected,
      removeJourney: state.removeJourney,
      selectPath: state.selectPath,
      deselectPath: state.deselectPath,
      clearHistory: state.clearHistory,
    }),
    shallow,
  );

  const isSelected = selected?.id === journey.id;
  const { classes } = useStyles();

  const setModalIsActive = useModalStore((state) => state.setIsActive);

  const [navlinkIsOpen, setNavlinkIsOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [relativeTime, setRelativeTime] = useState(dayjs().to(dayjs(journey.createdAt)));
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const theme = useMantineTheme();
  const { classes: modalClasses } = useModalStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      setRelativeTime(dayjs().to(dayjs(journey.createdAt)));
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [journey.createdAt]);

  const jnodes = useNodeStore((state) => state.jnodes);

  useEffect(() => {
    if (!isSelected) {
      setNavlinkIsOpen(false);
      setDeleteMode(false);
      return;
    }
  }, [isSelected]);

  const linkClickHandler = () => {
    if (isSelected) {
      return;
    }
    setSelected(journey);
  };

  const removeClickHandler = () => {
    setDeleteMode(true);
  };

  const removeCancelHandler = () => {
    setDeleteMode(false);
  };

  const removeConfirmHandler = () => {
    removeJourney(journey);
  };

  const switchToggleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectPath(journey, e.target.value);
    } else {
      deselectPath(journey, e.target.value);
    }
  };

  const expandHandler = (newIsOpened: boolean) => {
    setNavlinkIsOpen(newIsOpened);
  };

  const linkRightClickHandler = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setMenuIsOpen(journey.id);
  };

  const menuChangeHandler = (opened: boolean) => {
    if (opened) {
      return;
    }
    setMenuIsOpen(null);
  };

  const bookmarkClickHandler = () => {
    addBookmark({ id: generateId(journey.destinations), type: 'journey', journey });
    setTab('bookmarks');
    notifications.show({
      title: 'Added bookmark',
      message: journey.prompt.label,
      icon: <IconBookmarkPlus />,
      withBorder: true,
      autoClose: 10000,
    });
  };

  const removeHistoryClickHandler = () => {
    modals.openConfirmModal({
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 3 },
      closeButtonProps: { size: 'md' },
      centered: true,
      title: 'Confirmation',
      children: <Text>Please confirm that you want to remove this history item. This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: removeConfirmHandler,
      onClose: () => setModalIsActive(false),
    });
    setModalIsActive(true);
  };

  const clearHistoryClickHandler = () => {
    modals.openConfirmModal({
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 3 },
      closeButtonProps: { size: 'md' },
      centered: true,
      title: 'Confirmation',
      children: <Text>Please confirm that you want to clear your history. This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: clearHistory,
      onClose: () => setModalIsActive(false),
    });
    setModalIsActive(true);
  };

  return (
    <Menu opened={menuIsOpen === journey.id} onChange={menuChangeHandler} withArrow>
      <Menu.Target>
        <Tooltip label={journey.prompt.label} openDelay={500}>
          <NavLink
            component='li'
            role='menuitem'
            aria-label='History item'
            aria-expanded={navlinkIsOpen}
            classNames={{ children: classes.listItemChildren, root: classes.listItemRoot }}
            active={isSelected}
            onClick={linkClickHandler}
            onContextMenu={linkRightClickHandler}
            label={
              <Group position='apart' noWrap>
                <Text role='term' truncate>
                  {journey.prompt.label}
                </Text>
                {isSelected && !deleteMode && (
                  <ActionIcon aria-label='Delete history item' color='blue' onClick={removeClickHandler} size={20}>
                    <IconTrashX />
                  </ActionIcon>
                )}
                {isSelected && deleteMode && (
                  <Group spacing={4} noWrap>
                    <ActionIcon aria-label='Confirm delete' color='blue' onClick={removeConfirmHandler} size={20}>
                      <IconCheck />
                    </ActionIcon>
                    <ActionIcon aria-label='Cancel delete' color='blue' onClick={removeCancelHandler} size={20}>
                      <IconX />
                    </ActionIcon>
                  </Group>
                )}
              </Group>
            }
            description={relativeTime}
            opened={navlinkIsOpen}
            onChange={expandHandler}
          >
            {journey.destinations.length > 1 && (
              <Stack className={classes.switchContainer} role='region' aria-label='Destinations'>
                {journey.destinations.map((path) => {
                  const found = jnodes.get(path.id);
                  if (!found) {
                    return null;
                  }
                  return (
                    <Switch
                      role='switch'
                      aria-label={found.title}
                      aria-checked={path.enabled}
                      key={path.id}
                      label={found.title}
                      value={path.id}
                      checked={path.enabled}
                      onChange={switchToggleHandler}
                    />
                  );
                })}
              </Stack>
            )}
          </NavLink>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={bookmarkClickHandler}>Add to bookmarks</Menu.Item>
        <Menu.Item onClick={removeHistoryClickHandler}>Remove history item</Menu.Item>
        <Menu.Item onClick={clearHistoryClickHandler}>Clear history</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
