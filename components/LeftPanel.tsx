import { Button, Divider, Navbar, Text, Title, createStyles } from '@mantine/core';

import HistoryList from 'components/HistoryList';
import { IconPlus } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
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
        <Title order={2}>Dev Journey</Title>
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
        <Button disabled={noHistory} fullWidth variant='light' onClick={clearHistoryClickHandler}>
          Clear history
        </Button>
      </Navbar.Section>
    </Navbar>
  );
}
