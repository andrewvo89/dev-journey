import { Box, Button, Center, Container, Loader, Text, createStyles, useMantineTheme } from '@mantine/core';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import BookmarkListItem from 'components/LeftPanel/BookmarkListItem';
import { FiltersChooser } from 'components/FiltersChooser';
import { IconFilterEdit } from '@tabler/icons-react';
import { getLabel } from 'utils/bookmark';
import { modals } from '@mantine/modals';
import { useBookmarkStore } from 'store/bookmark';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useMemo } from 'react';
import { useModalStyles } from 'styles/modal';

const useStyles = createStyles(() => ({
  container: {
    padding: '0.5rem 0',
  },
  placeholderContainer: {
    padding: '1rem 0.75rem',
  },
}));

export default function BookmarksList() {
  const bookmarks = useHydratedStore(useBookmarkStore, (state) => state.bookmarks);
  const filters = useHydratedStore(useBookmarkStore, (state) => state.filters);
  const sort = useHydratedStore(useBookmarkStore, (state) => state.sort);

  const setBookmarks = useBookmarkStore((state) => state.setBookmarks);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const { classes } = useStyles();
  const { classes: modalClasses } = useModalStyles();
  const theme = useMantineTheme();

  const transformedBookmarks = useMemo(() => {
    if (!bookmarks || !filters || !sort) {
      return [];
    }
    const filtered = bookmarks.filter((bookmark) => filters.includes(bookmark.type));
    if (sort === 'none') {
      return filtered;
    }
    return filtered.sort((a, b) =>
      sort === 'asc' ? getLabel(a).localeCompare(getLabel(b)) : getLabel(b).localeCompare(getLabel(a)),
    );
  }, [bookmarks, filters, sort]);

  if (!bookmarks) {
    return (
      <Center>
        <Loader role='alert' aria-label='Loading bookmarks' aria-live='assertive' />
      </Center>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Box className={classes.placeholderContainer}>
        <Text>No bookmarks yet. Add a bookmark by right clicking any item.</Text>
      </Box>
    );
  }

  if (transformedBookmarks.length === 0) {
    const filtersClickHandler = () => {
      modals.open({
        classNames: { overlay: modalClasses.overlay, inner: modalClasses.inner, title: modalClasses.h3 },
        overlayProps: { color: theme.colors.gray[2], opacity: 0.55, blur: 1 },
        closeButtonProps: { size: 'md' },
        centered: true,
        title: 'Filters',
        children: <FiltersChooser />,
      });
    };

    return (
      <Box className={classes.placeholderContainer}>
        <Button fullWidth leftIcon={<IconFilterEdit size='1rem' />} onClick={filtersClickHandler}>
          Configure filters
        </Button>
      </Box>
    );
  }

  const onDragEndHandler = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (active.id === over?.id) {
      return;
    }
    const activeIndex = bookmarks.findIndex((bookmark) => bookmark.id === active.id);
    const overIndex = bookmarks.findIndex((bookmark) => bookmark.id === over?.id);

    if (overIndex === -1 || activeIndex === -1) {
      return;
    }

    setBookmarks(arrayMove(bookmarks, activeIndex, overIndex));
  };

  return (
    <Container className={classes.container}>
      <DndContext onDragEnd={onDragEndHandler} collisionDetection={closestCenter} sensors={sensors}>
        <SortableContext items={transformedBookmarks} strategy={verticalListSortingStrategy}>
          {transformedBookmarks.map((bookmark) => (
            <BookmarkListItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </SortableContext>
      </DndContext>
    </Container>
  );
}
