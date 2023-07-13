import { ActionIcon, Group, Menu, Text, Title, Tooltip, createStyles, useMantineTheme } from '@mantine/core';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import {
  IconBrandGithub,
  IconCommand,
  IconDotsVertical,
  IconFileAlert,
  IconFilterEdit,
  IconFilterOff,
  IconInfoCircle,
  IconPackageExport,
  IconPackageImport,
  IconPlus,
  IconSearch,
  IconSortAZ,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconTrashX,
  IconZoomReset,
} from '@tabler/icons-react';
import { issuesUrl, modKey } from 'utils/common';

import About from 'components/About';
import { BookmarkSort } from 'types/bookmark';
import { ExportDataModal } from 'components/ExportDataModal';
import { FiltersChooser } from 'components/FiltersChooser';
import { ImportDataModal } from 'components/ImportDataModal';
import KeyboardShortcuts from 'components/KeyboardShortcuts';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { shallow } from 'zustand/shallow';
import { spotlight } from '@mantine/spotlight';
import { useBookmarkStore } from 'store/bookmark';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useInputRefStore } from 'store/input-ref';
import { useModalStore } from 'store/modal';
import { useModalStyles } from 'styles/modal';
import { useNodeStore } from 'store/node';
import { useSettingsMenuStore } from 'store/settings-menu';
import { useTabStore } from 'store/tab';

const useStyles = createStyles(() => ({
  importInput: {
    display: 'none',
  },
  title: {
    ':hover': {
      cursor: 'pointer',
    },
  },
}));

export function TopSection() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [importFile, setImportFile] = useState<File>();

  const setModalIsActive = useModalStore((state) => state.setIsActive);
  const { isOpen: menuIsOpen, setIsOpen: setMenuIsOpen } = useSettingsMenuStore();

  const { clearHistory, setSelected } = useHistoryStore(
    (state) => ({ clearHistory: state.clearHistory, setSelected: state.setSelected }),
    shallow,
  );

  const updateNodes = useNodeStore((state) => state.updateNodes);

  const bookmarks = useHydratedStore(useBookmarkStore, (state) => state.bookmarks);
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);

  const { resetFilters, setSort } = useBookmarkStore(
    (state) => ({ resetFilters: state.selectAllFilters, setSort: state.setSort }),
    shallow,
  );

  const inputRef = useInputRefStore((state) => state.inputRef);
  const setTab = useTabStore((state) => state.setTab);

  const { classes: modalClasses } = useModalStyles();
  const { classes } = useStyles();
  const theme = useMantineTheme();

  useEffect(() => {
    if (importFile) {
      return;
    }
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  }, [importFile]);

  const newJourneyHandler = () => {
    if (!inputRef) {
      return;
    }
    inputRef.focus();
    setSelected(null);
  };

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
      onClose: () => setModalIsActive(false),
    });
    setModalIsActive(true);
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
      closeButtonProps: { size: 'lg' },
      centered: true,
      title: 'Filters',
      children: <FiltersChooser />,
      onClose: () => setModalIsActive(false),
    });
    setModalIsActive(true);
  };

  const sortBookmarksHandler = (order: BookmarkSort) => {
    setTab('bookmarks');
    setSort(order);
  };

  const resetFiltersHandler = () => {
    setTab('bookmarks');
    resetFilters();
  };

  const importDataHandler = () => {
    importInputRef.current?.click();
  };

  const exportDataHandler = () => {
    setExportModalIsOpen(true);
  };

  const importConfirmHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.type !== 'application/json' || !file.name.endsWith('.json')) {
      notifications.show({
        title: 'Invalid file',
        message: 'File must be a valid .json file',
        icon: <IconFileAlert />,
        color: 'red',
        withBorder: true,
        autoClose: 10000,
      });
      return;
    }
    setImportFile(file);
  };

  const keyboardShortcutClickHandler = () => {
    modals.open({
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 1 },
      closeButtonProps: { size: 'md' },
      centered: true,
      title: 'Keyboard shortcuts',
      children: <KeyboardShortcuts />,
      size: 'lg',
      onClose: () => setModalIsActive(false),
    });
    setModalIsActive(true);
  };

  const aboutClickHandler = () => {
    modals.open({
      classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
      overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 1 },
      closeButtonProps: { size: 'md' },
      centered: true,
      title: 'About',
      children: <About />,
      size: 'lg',
      onClose: () => setModalIsActive(false),
    });
    setModalIsActive(true);
  };

  return (
    <Fragment>
      <input onChange={importConfirmHandler} className={classes.importInput} type='file' ref={importInputRef} />
      <ImportDataModal file={importFile} setFile={setImportFile} />
      <ExportDataModal isOpen={exportModalIsOpen} setIsOpen={setExportModalIsOpen} />
      <Group position='apart'>
        <Title order={2} onClick={resetViewClickHandler} className={classes.title}>
          Dev Journey
        </Title>
        <Group>
          <Tooltip label={`Search (${modKey} + f)`}>
            <ActionIcon color='dark' variant='transparent' aria-label='Search'>
              <IconSearch onClick={() => spotlight.open()} />
            </ActionIcon>
          </Tooltip>
          <Menu opened={menuIsOpen} onChange={setMenuIsOpen}>
            <Menu.Target>
              <Tooltip label={`Menu (${modKey} + m)`}>
                <ActionIcon color='dark' variant='transparent' aria-label='Menu' onClick={() => setMenuIsOpen(true)}>
                  <IconDotsVertical />
                </ActionIcon>
              </Tooltip>
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
              <Menu.Divider />
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
                onClick={() => sortBookmarksHandler('none')}
                icon={<IconSortAZ size='1.25em' />}
                disabled={!bookmarks || bookmarks.length === 0}
              >
                Reset bookmark sort
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
              <Menu.Divider />
              <Menu.Item onClick={importDataHandler} icon={<IconPackageImport size='1.25em' />}>
                Import data
              </Menu.Item>
              <Menu.Item onClick={exportDataHandler} icon={<IconPackageExport size='1.25em' />}>
                Export data
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => null}
                icon={<IconBrandGithub size='1.25em' />}
                component='a'
                href={`${issuesUrl}/new?title=Dataset change request`}
                target='_blank'
                rel='noopener noreferrer'
              >
                Contribute to dataset
              </Menu.Item>
              <Menu.Item onClick={keyboardShortcutClickHandler} icon={<IconCommand size='1.25em' />}>
                Keyboard shortcuts
              </Menu.Item>
              <Menu.Item onClick={aboutClickHandler} icon={<IconInfoCircle size='1.25em' />}>
                About
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Fragment>
  );
}
