import { IconBookmarkPlus, IconClipboard } from '@tabler/icons-react';
import { Menu, Tooltip, createStyles } from '@mantine/core';
import { MouseEvent, useState } from 'react';

import { FieldMap } from 'components/ResourceTable';
import { Resource } from 'types/jnode';
import { notifications } from '@mantine/notifications';
import { useBookmarkStore } from 'store/bookmark';
import { useTabStore } from 'store/tab';

const useStyles = createStyles((theme) => ({
  tr: {
    '&&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[1],
    },
  },
}));

type Props<T extends Resource> = {
  resource: T;
  fieldMappings: FieldMap<T>[];
};

export default function ResourceItem<T extends Resource>(props: Props<T>) {
  const { resource, fieldMappings } = props;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { classes } = useStyles();
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const setTab = useTabStore((state) => state.setTab);

  const bookmarkClickHandler = () => {
    switch (resource.type) {
      case 'article':
        addBookmark({ id: resource.url, type: 'article', article: resource });
        break;
      case 'book':
        addBookmark({ id: resource.url, type: 'book', book: resource });
        break;
      case 'course':
        addBookmark({ id: resource.url, type: 'course', course: resource });
        break;
      case 'misc':
        addBookmark({ id: resource.url, type: 'misc', misc: resource });
        break;
      case 'video':
        addBookmark({ id: resource.url, type: 'video', video: resource });
        break;
    }
    setTab('bookmarks');
    notifications.show({ title: 'Added bookmark', message: resource.title, icon: <IconBookmarkPlus /> });
  };

  const rowClickHandler = () => {
    window.open(resource.url, '_blank', 'noreferrer');
  };

  const rowRightClickHandler = (e: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setMenuIsOpen(true);
  };

  const copyToClipboardHandler = (text: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({ title: 'Copied to clipboard', message: text, icon: <IconClipboard /> });
  };

  return (
    <Menu opened={menuIsOpen} onChange={setMenuIsOpen} withArrow>
      <Menu.Target>
        <Tooltip label={resource.url} openDelay={500}>
          <tr className={classes.tr} onClick={rowClickHandler} onContextMenu={rowRightClickHandler}>
            {fieldMappings.map((field) => (
              <td key={field.key.toString()}>
                {field.transform?.(resource[field.key]) ?? String(resource[field.key])}
              </td>
            ))}
          </tr>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label w={200}>{resource.title}</Menu.Label>
        <Menu.Divider />
        <Menu.Item onClick={bookmarkClickHandler}>Add to bookmarks</Menu.Item>
        <Menu.Item onClick={rowClickHandler}>Open link</Menu.Item>
        <Menu.Item onClick={() => copyToClipboardHandler(resource.url)}>Copy link</Menu.Item>
        {fieldMappings.map((field) => (
          <Menu.Item
            key={field.key.toString()}
            onClick={() =>
              copyToClipboardHandler(field.transform?.(resource[field.key]) ?? String(resource[field.key]))
            }
          >
            Copy {field.heading.toLowerCase()}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
