import { Button, Checkbox, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { ChangeEvent, useState } from 'react';
import { createExportJSON, getPrettyType, importTypes } from 'utils/import-export';

import { IconPackageExport } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { getPrettySort } from 'utils/bookmark';
import { importTypeSchema } from 'schemas/import-export';
import { notifications } from '@mantine/notifications';
import { produce } from 'immer';
import { useBookmarkStore } from 'store/bookmark';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useModalStyles } from 'styles/modal';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function ExportDataModal(props: Props) {
  const { isOpen, setIsOpen } = props;
  const [exportTypes, setExportTypes] = useState(importTypes);
  const bookmarks = useHydratedStore(useBookmarkStore, (state) => state.bookmarks);
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const filters = useHydratedStore(useBookmarkStore, (state) => state.filters);
  const sort = useHydratedStore(useBookmarkStore, (state) => state.sort);

  const { classes: modalClasses } = useModalStyles();
  const theme = useMantineTheme();

  const allChecked = importTypes.every((type) => exportTypes.includes(type));
  const indeterminate = importTypes.some((type) => exportTypes.includes(type)) && !allChecked;

  if (!bookmarks || !journeys || !filters || !sort) {
    return null;
  }

  const childCheckboxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = importTypeSchema.safeParse(e.currentTarget.value);
    if (!parsed.success) {
      return;
    }

    const exportType = parsed.data;

    if (e.currentTarget.checked) {
      setExportTypes((prev) => {
        const foundIndex = prev.indexOf(exportType);
        if (foundIndex === -1) {
          return produce(prev, (draft) => {
            draft.push(exportType);
          });
        }
        return prev;
      });
    } else {
      setExportTypes((prev) => {
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
      setExportTypes(importTypes);
    } else {
      setExportTypes([]);
    }
  };

  const exportConfirmHandler = () => {
    const link = document.createElement('a');
    link.href = createExportJSON({
      history: exportTypes.includes('history') ? journeys : undefined,
      bookmarks: exportTypes.includes('bookmarks') ? bookmarks : undefined,
      filters: exportTypes.includes('filters') ? filters : undefined,
      sort: exportTypes.includes('sort') ? sort : undefined,
    });
    link.download = `export-${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.json`;
    link.click();
    link.remove();
    setIsOpen(false);
    notifications.show({
      title: 'Export',
      message: 'File prepared for downloading',
      icon: <IconPackageExport />,
      withBorder: true,
    });
  };

  return (
    <Modal.Root
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      classNames={{ overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 }}
      centered
    >
      <Modal.Overlay color={theme.colors.gray[2]} opacity={0.55} blur={1} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
          <Modal.CloseButton size='md' />
        </Modal.Header>
        <Modal.Body>
          <Stack mb='1rem'>
            <Checkbox
              label='Select all'
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={parentCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='history'
              label={`${getPrettyType('history')} (${journeys.length})`}
              checked={exportTypes.includes('history')}
              onChange={childCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='bookmarks'
              label={`${getPrettyType('bookmarks')} (${bookmarks.length})`}
              checked={exportTypes.includes('bookmarks')}
              onChange={childCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='filters'
              label={`${getPrettyType('filters')} (${filters.length})`}
              checked={exportTypes.includes('filters')}
              onChange={childCheckboxChangeHandler}
            />
            <Checkbox
              ml='xl'
              value='sort'
              label={`${getPrettyType('sort')} (${getPrettySort(sort)})`}
              checked={exportTypes.includes('sort')}
              onChange={childCheckboxChangeHandler}
            />
          </Stack>
          <Group position='right'>
            <Button onClick={() => setIsOpen(false)} variant='outline'>
              Close
            </Button>
            <Button onClick={exportConfirmHandler}>Confirm</Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
