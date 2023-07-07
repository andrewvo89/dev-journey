import { CSS, Transform } from '@dnd-kit/utilities';
import { Fragment, MouseEvent } from 'react';
import { Menu, NavLink, Text, Tooltip, createStyles, useMantineTheme } from '@mantine/core';
import { getAction, getIcon, getLabel, getPrettyType, getSubtitle, getUrl } from 'utils/bookmark';

import { Bookmark } from 'types/bookmark';
import { FiltersChooser } from 'components/FiltersChooser';
import { IconClipboard } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { shallow } from 'zustand/shallow';
import { useBookmarkCtxMenuStore } from 'store/bookmark-context-menu';
import { useBookmarkStore } from 'store/bookmark';
import { useHistoryStore } from 'store/history';
import { useModalStyles } from 'styles/modal';
import { useNodeStore } from 'store/node';
import { useSortable } from '@dnd-kit/sortable';

type Props = {
  bookmark: Bookmark;
};

type StyleProps = {
  transform: Transform | null;
  transition: string | undefined;
  isDragging: boolean;
  isOver: boolean;
};

const useStyles = createStyles((theme, props: StyleProps) => ({
  listItemChildren: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  listItemRoot: {
    borderRadius: 8,
    transform: CSS.Transform.toString(props.transform),
    transition: props.transition,
    boxShadow: props.isDragging ? theme.shadows.sm : undefined,
    backgroundColor: theme.white,
    ':hover': {
      backgroundColor: props.isOver || props.isDragging ? theme.white : theme.colors.gray[0],
    },
  },
  switch: {
    padding: '0.625rem 0.75rem',
  },
}));

export default function BookmarkListItem(props: Props) {
  const { bookmark } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: bookmark.id,
  });
  const { classes } = useStyles({ transform, transition, isDragging, isOver });
  const theme = useMantineTheme();

  const updateNodes = useNodeStore((state) => state.updateNodes);
  const setSelected = useHistoryStore((state) => state.setSelected);
  const { menuIsOpen, setMenuIsOpen } = useBookmarkCtxMenuStore();
  const { removeBookmark, sortBookmarks } = useBookmarkStore(
    (state) => ({ removeBookmark: state.removeBookmark, sortBookmarks: state.sortBookmarks }),
    shallow,
  );
  const { classes: modalClasses } = useModalStyles();

  const label = getLabel(bookmark);

  const bookmarkActionHandler = () => {
    switch (bookmark.type) {
      case 'article':
        window.open(bookmark.article.url, '_blank', 'noreferrer');
        break;
      case 'book':
        window.open(bookmark.book.url, '_blank', 'noreferrer');
        break;
      case 'course':
        window.open(bookmark.course.url, '_blank', 'noreferrer');
        break;
      case 'misc':
        window.open(bookmark.misc.url, '_blank', 'noreferrer');
        break;
      case 'video':
        window.open(bookmark.video.url, '_blank', 'noreferrer');
        break;
      case 'destination':
        updateNodes([{ id: bookmark.jnode.id, enabled: true }]);
        setSelected(null);
        break;
      case 'journey':
        updateNodes(bookmark.journey.destinations);
        break;
    }
  };

  const bookmarkRightClickHandler = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setMenuIsOpen(bookmark.id);
  };

  const menuChangeHandler = (opened: boolean) => {
    if (opened) {
      return;
    }
    setMenuIsOpen(null);
  };

  const removeBookmarkHandler = () => {
    removeBookmark(bookmark.id);
  };

  const copyToClipboardHandler = (text: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({ title: 'Copied to clipboard', message: text, icon: <IconClipboard /> });
  };

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

  const Icon = getIcon(bookmark.type);

  return (
    <Menu opened={menuIsOpen === bookmark.id} onChange={menuChangeHandler} withArrow>
      <Menu.Target>
        <Tooltip
          label={
            <Fragment>
              <Text>{label}</Text>
              <Text c='dimmed' size='xs'>
                {getSubtitle(bookmark)}
              </Text>
            </Fragment>
          }
          openDelay={500}
          disabled={isDragging}
        >
          <NavLink
            classNames={{ children: classes.listItemChildren, root: classes.listItemRoot }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            component='li'
            role='menuitem'
            aria-label='History item'
            onContextMenu={bookmarkRightClickHandler}
            onClick={bookmarkActionHandler}
            label={<Text truncate>{label}</Text>}
            description={getPrettyType(bookmark.type)}
            icon={<Icon />}
          />
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item onClick={bookmarkActionHandler}>{getAction(bookmark.type)}</Menu.Item>
        {(() => {
          const url = getUrl(bookmark);
          return url ? <Menu.Item onClick={() => copyToClipboardHandler(url)}>Copy link</Menu.Item> : null;
        })()}
        <Menu.Item onClick={removeBookmarkHandler}>Remove from bookmarks</Menu.Item>
        <Menu.Divider />
        <Menu.Label>Sort</Menu.Label>
        <Menu.Item onClick={() => sortBookmarks('asc')}>Ascending</Menu.Item>
        <Menu.Item onClick={() => sortBookmarks('desc')}>Descending</Menu.Item>
        <Menu.Divider />
        <Menu.Label>Filter</Menu.Label>
        <Menu.Item onClick={filtersClickHandler}>Configure filters</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
