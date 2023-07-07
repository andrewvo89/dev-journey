import { ActionIcon, Group, Menu, Text, Title, useMantineTheme } from '@mantine/core';
import {
  IconDotsVertical,
  IconFilterEdit,
  IconFilterOff,
  IconPlus,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconTrashX,
  IconZoomReset,
} from '@tabler/icons-react';

import { FiltersChooser } from 'components/FiltersChooser';
import { modals } from '@mantine/modals';
import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from 'store/bookmark';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useInputRefStore } from 'store/input-ref';
import { useModalStyles } from 'styles/modal';
import { useNodeStore } from 'store/node';
import { useTabStore } from 'store/tab';

export function TopSection() {
  const { clearHistory, setSelected } = useHistoryStore(
    (state) => ({ clearHistory: state.clearHistory, setSelected: state.setSelected }),
    shallow,
  );
  const updateNodes = useNodeStore((state) => state.updateNodes);
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const inputRef = useInputRefStore((state) => state.inputRef);
  const { resetFilters, sortBookmarks, bookmarks } = useBookmarkStore(
    (state) => ({
      resetFilters: state.selectAllFilters,
      sortBookmarks: state.sortBookmarks,
      bookmarks: state.bookmarks,
    }),
    shallow,
  );
  const setTab = useTabStore((state) => state.setTab);

  const newJourneyHandler = () => {
    setTab('history');
    if (!inputRef) {
      return;
    }
    inputRef.focus();
    setSelected(null);
  };

  const { classes: modalClasses } = useModalStyles();
  const theme = useMantineTheme();

  const clearHistoryClickHandler = () => {
    setTab('history');
    modals.openConfirmModal({
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 3 },
      closeButtonProps: { size: 'md' },
      centered: true,
      title: 'Confirmation',
      children: <Text>Please confirm that you want to clear your history. This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: clearHistory,
    });
  };

  const resetViewClickHandler = () => {
    setSelected(null);
    updateNodes([]);
  };

  const filtersClickHandler = () => {
    setTab('bookmarks');
    modals.open({
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 1 },
      closeButtonProps: { size: 'md' },
      centered: true,
      title: 'Filters',
      children: <FiltersChooser />,
    });
  };

  const sortBookmarksHandler = (order: 'asc' | 'desc') => {
    setTab('bookmarks');
    sortBookmarks(order);
  };

  const resetFiltersHandler = () => {
    setTab('bookmarks');
    resetFilters();
  };

  return (
    <Group position='apart'>
      <Title order={2}>Dev Journey</Title>
      <Menu>
        <Menu.Target>
          <ActionIcon color='dark' variant='transparent' aria-label='Menu'>
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={newJourneyHandler} icon={<IconPlus size='1.25em' />}>
            New journey
          </Menu.Item>
          <Menu.Item
            onClick={clearHistoryClickHandler}
            icon={<IconTrashX size='1.25em' />}
            disabled={!journeys || journeys.length === 0}
          >
            Clear history
          </Menu.Item>
          <Menu.Item
            onClick={() => sortBookmarksHandler('asc')}
            icon={<IconSortAscendingLetters size='1.25em' />}
            disabled={!bookmarks || bookmarks.length === 0}
          >
            Sort bookmarks ascending
          </Menu.Item>
          <Menu.Item
            onClick={() => sortBookmarksHandler('desc')}
            icon={<IconSortDescendingLetters size='1.25em' />}
            disabled={!bookmarks || bookmarks.length === 0}
          >
            Sort bookmarks descending
          </Menu.Item>
          <Menu.Item
            onClick={filtersClickHandler}
            icon={<IconFilterEdit size='1.25em' />}
            disabled={!bookmarks || bookmarks.length === 0}
          >
            Configure filters
          </Menu.Item>
          <Menu.Item
            onClick={resetFiltersHandler}
            icon={<IconFilterOff size='1.25em' />}
            disabled={!bookmarks || bookmarks.length === 0}
          >
            Reset bookmark filters
          </Menu.Item>
          <Menu.Item onClick={resetViewClickHandler} icon={<IconZoomReset size='1.25em' />}>
            Reset view
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
