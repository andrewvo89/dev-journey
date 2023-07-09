import { Group, Kbd, Stack, Text } from '@mantine/core';

import { Fragment } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { modKey } from 'utils/common';

type Props = {
  shortcut: string;
  kbds: string[];
};

function KeyboardShortcut(props: Props) {
  const { kbds, shortcut } = props;
  return (
    <Group position='apart'>
      <Text truncate>{shortcut}</Text>
      <Group spacing='xs'>
        {kbds.map((kbd, index) => (
          <Fragment key={kbd}>
            <Kbd>{kbd}</Kbd>
            {index !== kbds.length - 1 && <IconPlus size='1rem' />}
          </Fragment>
        ))}
      </Group>
    </Group>
  );
}

export default function KeyboardShortcuts() {
  return (
    <Stack spacing='1rem'>
      <KeyboardShortcut shortcut='Search for journeys, destinations or bookmarks' kbds={[modKey, 'shift', 'f']} />
      <KeyboardShortcut shortcut='Open settings menu' kbds={[modKey, 'shift', 'm']} />
      <KeyboardShortcut shortcut='Start a new journey' kbds={[modKey, 'shift', 'j']} />
      <KeyboardShortcut shortcut='Reset view to default' kbds={[modKey, 'shift', 'r']} />
      <KeyboardShortcut shortcut='Go to history tab' kbds={[modKey, 'shift', 'h']} />
      <KeyboardShortcut shortcut='Go to bookmarks tab' kbds={[modKey, 'shift', 'b']} />
      <KeyboardShortcut shortcut='Go to info tab' kbds={[modKey, 'shift', 'i']} />
    </Stack>
  );
}
