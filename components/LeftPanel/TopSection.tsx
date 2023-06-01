import { ActionIcon, Group, Menu, Text, Title, createStyles, useMantineTheme } from '@mantine/core';
import { IconDotsVertical, IconPlus, IconTrashX } from '@tabler/icons-react';

import { modals } from '@mantine/modals';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';

type Props = {
  newJourneyHandler: () => void;
};

const useStyles = createStyles(() => ({
  overlay: {
    zIndex: 1001,
  },
  inner: {
    zIndex: 1002,
  },
}));

export function TopSection(props: Props) {
  const { newJourneyHandler } = props;
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);

  const { classes } = useStyles();
  const theme = useMantineTheme();

  const clearHistoryClickHandler = () =>
    modals.openConfirmModal({
      classNames: {
        overlay: classes.overlay,
        inner: classes.inner,
      },
      overlayProps: {
        color: theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      },
      centered: true,
      title: 'Confirmation',
      children: <Text>Please confirm that you want to clear your history. This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: clearHistory,
    });

  return (
    <Group position='apart'>
      <Title order={2}>Dev Journey</Title>
      <Menu width={200}>
        <Menu.Target>
          <ActionIcon color='dark' variant='transparent'>
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={newJourneyHandler} icon={<IconPlus size='1.25em' />}>
            New journey
          </Menu.Item>
          <Menu.Item
            onClick={clearHistoryClickHandler}
            icon={<IconTrashX size='1.25em' />}
            disabled={journeys?.length === 0}
          >
            Clear history
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
