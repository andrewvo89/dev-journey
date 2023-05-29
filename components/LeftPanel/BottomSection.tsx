import { Group, Text } from '@mantine/core';

import packageJSON from 'package.json';

export default function BottomSection() {
  return (
    <Group position='center' spacing='xs'>
      <Text align='center' color='dimmed' size='sm'>
        Version {packageJSON.version}
      </Text>
    </Group>
  );
}
