import { Alert, Button, Checkbox, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { Bookmark, BookmarkFilter, BookmarkSort } from 'types/bookmark';
import { ChangeEvent, useEffect, useState } from 'react';
import { IconAlertCircle, IconPackageImport } from '@tabler/icons-react';
import { bookmarkSchema, bookmarkSortSchema, bookmarkTypeSchema } from 'schemas/bookmark';

import { ImportType } from 'types/import-export';
import { Journey } from 'types/journey';
import { getPrettySort } from 'utils/bookmark';
import { getPrettyType } from 'utils/import-export';
import { importTypeSchema } from 'schemas/import-export';
import { journeySchema } from 'schemas/journey';
import { notifications } from '@mantine/notifications';
import { produce } from 'immer';
import { useBookmarkStore } from 'store/bookmark';
import { useHistoryStore } from 'store/history';
import { useModalStyles } from 'styles/modal';

type Props = {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
};

export function ImportDataModal(props: Props) {
  const { file, setFile } = props;
  const [importTypes, setImportTypes] = useState<ImportType[]>([]);
  const [enabledTypes, setEnabledTypes] = useState<ImportType[]>([]);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>();
  const setStoreBookmarks = useBookmarkStore((state) => state.setBookmarks);
  const [journeys, setJourneys] = useState<Journey[]>();
  const setStoreJourneys = useHistoryStore((state) => state.setJourneys);
  const [filters, setFilters] = useState<BookmarkFilter[]>();
  const setStoreFilters = useBookmarkStore((state) => state.setFilters);
  const [sort, setSort] = useState<BookmarkSort>();
  const setStoreSort = useBookmarkStore((state) => state.setSort);

  const { classes: modalClasses } = useModalStyles();
  const theme = useMantineTheme();

  useEffect(() => {
    if (!file) {
      setImportTypes([]);
      setBookmarks(undefined);
      setJourneys(undefined);
      setFilters(undefined);
      setSort(undefined);
      return;
    }
    file.text().then((text) => {
      const root = JSON.parse(text);
      const parsedHistory = journeySchema.array().safeParse(root.history);
      const newImportTypes: ImportType[] = [];
      if (parsedHistory.success) {
        setJourneys(parsedHistory.data);
        newImportTypes.push('history');
      }
      const parsedBookmarks = bookmarkSchema.array().safeParse(root.bookmarks);
      if (parsedBookmarks.success) {
        setBookmarks(parsedBookmarks.data);
        newImportTypes.push('bookmarks');
      }
      const parsedFilters = bookmarkTypeSchema.array().safeParse(root.filters);
      if (parsedFilters.success) {
        setFilters(parsedFilters.data);
        newImportTypes.push('filters');
      }
      const parsedSort = bookmarkSortSchema.safeParse(root.sort);
      if (parsedSort.success) {
        setSort(parsedSort.data);
        newImportTypes.push('sort');
      }
      setImportTypes(newImportTypes);
      setEnabledTypes(newImportTypes);
    });
  }, [file]);

  const allChecked = importTypes.length === enabledTypes.length;
  const indeterminate = importTypes.length > 0 && !allChecked;

  if (!file) {
    return null;
  }

  const childCheckboxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = importTypeSchema.safeParse(e.currentTarget.value);
    if (!parsed.success) {
      return;
    }

    const exportType = parsed.data;

    if (e.currentTarget.checked) {
      setImportTypes((prev) => {
        const foundIndex = prev.indexOf(exportType);
        if (foundIndex === -1) {
          return produce(prev, (draft) => {
            draft.push(exportType);
          });
        }
        return prev;
      });
    } else {
      setImportTypes((prev) => {
        const foundIndex = prev.indexOf(exportType);
        if (foundIndex !== -1) {
          return produce(prev, (draft) => {
            draft.splice(foundIndex, 1);
          });
        }
        return prev;
      });
    }
  };

  const parentCheckboxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      setImportTypes(enabledTypes);
    } else {
      setImportTypes([]);
    }
  };

  const importConfirmHandler = () => {
    if (bookmarks) {
      setStoreBookmarks(bookmarks);
    }
    if (journeys) {
      setStoreJourneys(journeys);
    }
    if (filters) {
      setStoreFilters(filters);
    }
    if (sort) {
      setStoreSort(sort);
    }
    setFile(undefined);
    notifications.show({
      title: 'Import',
      message: 'File imported successfully',
      icon: <IconPackageImport />,
      withBorder: true,
    });
  };

  return (
    <Modal.Root
      opened={!!file}
      onClose={() => setFile(undefined)}
      classNames={{ overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 }}
      centered
    >
      <Modal.Overlay color={theme.colors.gray[2]} opacity={0.55} blur={1} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Import</Modal.Title>
          <Modal.CloseButton size='md' />
        </Modal.Header>
        <Modal.Body>
          <Stack mb='1rem'>
            <Alert title='Warning' icon={<IconAlertCircle size='1rem' />} color='red'>
              For any items selected below, the existing items will be overwritten.
            </Alert>
            <Checkbox
              label='Select all'
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={parentCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='history'
              label={`${getPrettyType('history')} ${journeys ? `(${journeys.length})` : ''}`}
              checked={importTypes.includes('history')}
              disabled={!journeys}
              onChange={childCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='bookmarks'
              label={`${getPrettyType('bookmarks')} ${bookmarks ? `(${bookmarks.length})` : ''}`}
              checked={importTypes.includes('bookmarks')}
              disabled={!bookmarks}
              onChange={childCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='filters'
              label={`${getPrettyType('filters')} ${filters ? `(${filters.length})` : ''}`}
              checked={importTypes.includes('filters')}
              disabled={!filters}
              onChange={childCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='sort'
              label={`${getPrettyType('sort')} ${sort ? `(${getPrettySort(sort)})` : ''}`}
              checked={importTypes.includes('sort')}
              disabled={!sort}
              onChange={childCheckboxChangeHandler}
            />
          </Stack>
          <Group position='right'>
            <Button onClick={() => setFile(undefined)} variant='outline'>
              Close
            </Button>
            <Button onClick={importConfirmHandler}>Confirm</Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
