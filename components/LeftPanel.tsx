import { Button, Divider, Navbar, Title, createStyles } from '@mantine/core';

import HistoryList from 'components/HistoryList';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';

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
  const setSelected = useHistoryStore((state) => state.setSelected);
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const showClearHistory = journeys !== undefined && journeys.length > 0;

  const outsideClickHandler = () => {
    setSelected(null);
  };
  return (
    <Navbar className={classes.navbar} width={{ base: 300 }}>
      <Navbar.Section>
        <Title order={2}>Dev Journey</Title>
      </Navbar.Section>
      <Divider my='sm' />
      <Navbar.Section grow onClick={outsideClickHandler}>
        <HistoryList />
      </Navbar.Section>
      {showClearHistory && (
        <Navbar.Section>
          <Button fullWidth>Clear history</Button>
        </Navbar.Section>
      )}
    </Navbar>
  );
}
