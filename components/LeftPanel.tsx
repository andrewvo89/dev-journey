import { ActionIcon, Button, Divider, Group, Menu, Navbar, Text, Title, createStyles } from '@mantine/core';
import { IconDotsVertical, IconPlus, IconTrashX } from '@tabler/icons-react';

import HistoryList from 'components/HistoryList';
import { modals } from '@mantine/modals';
import packageJSON from 'package.json';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useInputRefStore } from 'store/input-ref';

const useStyles = createStyles((theme) => ({
  navbar: {
    width: 300,
    [theme.fn.smallerThan('md')]: {
      width: 200,
    },
    [theme.fn.smallerThan('sm')]: {
      width: 150,
    },
    padding: 8,
  },
}));

export default function LeftPanel() {
  const { classes } = useStyles();

  const { setSelected, clearHistory } = useHistoryStore(
    (state) => ({ setSelected: state.setSelected, clearHistory: state.clearHistory }),
    shallow,
  );
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const inputRef = useInputRefStore((state) => state.inputRef);
  const noHistory = journeys?.length === 0;

  const outsideClickHandler = () => {
    setSelected(null);
  };

  const clearHistoryClickHandler = () =>
    modals.openConfirmModal({
      centered: true,
      title: 'Confirmation',
      children: <Text>Please confirm that you want to clear your history. This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: clearHistory,
    });

  const newJourneyClickHandler = () => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  return (
    <Navbar className={classes.navbar} width={{ base: 300 }}>
      <Navbar.Section>
        <Group position='apart'>
          <Title order={2}>Dev Journey</Title>
          <Menu width={200}>
            <Menu.Target>
              <ActionIcon color='dark' variant='transparent'>
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={newJourneyClickHandler} icon={<IconPlus size='1.25em' />}>
                New journey
              </Menu.Item>
              <Menu.Item onClick={clearHistoryClickHandler} icon={<IconTrashX size='1.25em' />} disabled={noHistory}>
                Clear history
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Navbar.Section>
      <Divider my='sm' />
      <Navbar.Section grow onClick={outsideClickHandler}>
        {noHistory && (
          <Button fullWidth leftIcon={<IconPlus size='1rem' />} onClick={newJourneyClickHandler}>
            Start new journey
          </Button>
        )}
        <HistoryList />
      </Navbar.Section>
      <Navbar.Section>
        <Group position='center' spacing='xs'>
          <Text align='center' color='dimmed' size='sm'>
            Version {packageJSON.version}
          </Text>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}
