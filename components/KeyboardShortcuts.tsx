import { Divider, Group, Kbd, Stack, Text } from '@mantine/core';

import { Fragment } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { modKey } from 'utils/common';

type KeyCombination = { id: string; keys: string[] };

type Props = {
  shortcut: string;
  kbds: KeyCombination[];
};

function KeyboardShortcut(props: Props) {
  const { kbds, shortcut } = props;
  return (
    <Stack>
      <Group position='apart' align='flex-start'>
        <Text truncate>{shortcut}</Text>
        <Stack>
          {kbds.map(({ id, keys }) => (
            <Group key={id} spacing='xs' position='right'>
              {keys.map((key, index, arr) => (
                <Fragment key={key}>
                  <Kbd>{key}</Kbd>
                  {index !== arr.length - 1 && <IconPlus size='1rem' />}
                </Fragment>
              ))}
            </Group>
          ))}
        </Stack>
      </Group>
      <Divider />
    </Stack>
  );
}

export default function KeyboardShortcuts() {
  return (
    <Stack spacing='1rem'>
      <KeyboardShortcut
        shortcut='Search for journeys, destinations or bookmarks'
        kbds={[{ id: 'primary', keys: [modKey, 'f'] }]}
      />
      <KeyboardShortcut shortcut='Open settings menu' kbds={[{ id: 'primary', keys: [modKey, 'm'] }]} />
      <KeyboardShortcut
        shortcut='Start a new journey'
        kbds={[
          { id: 'primary', keys: ['/'] },
          { id: 'secondary', keys: [modKey, 'j'] },
        ]}
      />
      <KeyboardShortcut shortcut='Reset view to default' kbds={[{ id: 'primary', keys: [modKey, 'r'] }]} />
      <KeyboardShortcut shortcut='Go to history tab' kbds={[{ id: 'primary', keys: [modKey, 'h'] }]} />
      <KeyboardShortcut shortcut='Go to bookmarks tab' kbds={[{ id: 'primary', keys: [modKey, 'b'] }]} />
      <KeyboardShortcut shortcut='Go to info tab' kbds={[{ id: 'primary', keys: [modKey, 'i'] }]} />
    </Stack>
  );
}
