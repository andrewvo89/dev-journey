import { ActionIcon, Button, Divider, Group, Menu, Navbar, Text, Title, createStyles } from '@mantine/core';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';

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

  const newJourneyCLickHandler = () => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  return (
    <Navbar className={classes.navbar} width={{ base: 300 }}>
      <Navbar.Section>
        <Group position='apart'>
          <Title order={2}>Dev Journey</Title>
          <Menu>
            <Menu.Target>
              <ActionIcon color='dark' variant='transparent'>
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={newJourneyCLickHandler}>New journey</Menu.Item>
              <Menu.Item onClick={clearHistoryClickHandler} disabled={noHistory}>
                Clear history
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Navbar.Section>
      <Divider my='sm' />
      <Navbar.Section grow onClick={outsideClickHandler}>
        {noHistory && (
          <Button fullWidth leftIcon={<IconPlus size='1rem' />} onClick={newJourneyCLickHandler}>
            Start new journey
          </Button>
        )}
        <HistoryList />
      </Navbar.Section>
      <Navbar.Section>
        <Group position='center' spacing='xs'>
          {/* <Anchor href='mailto:info@devjourney.com' color='dimmed' size='sm'>
            devjourney@andrewvo.co
          </Anchor>
          <Text align='center' color='dimmed' size='sm'>
            •
          </Text> */}
          <Text align='center' color='dimmed' size='sm'>
            Version {packageJSON.version}
          </Text>
        </Group>
        {/* <Text align='center' color='dimmed' size='sm'>
          Copyright © {dayjs().format('YYYY')}
        </Text> */}
      </Navbar.Section>
    </Navbar>
  );
}
