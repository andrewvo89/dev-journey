import { Menu, Tooltip, createStyles } from '@mantine/core';
import { MouseEvent, useState } from 'react';

import { FieldMap } from 'components/ResourceTable';
import { IconClipboard } from '@tabler/icons-react';
import { Resource } from 'types/jnode';
import { notifications } from '@mantine/notifications';

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

  const rowClickHandler = () => {
    window.open(resource.url, '_blank', 'noreferrer');
  };

  const rowRightClickHandler = (e: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setMenuIsOpen(true);
  };

  const copyToClipboardHandler = (text: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({
      title: 'Copied to clipboard',
      message: text,
      icon: <IconClipboard />,
    });
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
