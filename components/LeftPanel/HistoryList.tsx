import { Box, Button, Center, Flex, Loader, createStyles } from '@mantine/core';

import HistoryListItem from 'components/LeftPanel/HistoryListItem';
import { IconPlus } from '@tabler/icons-react';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useInputRefStore } from 'store/input-ref';

const useStyles = createStyles(() => ({
  container: {
    flexDirection: 'column',
    padding: '0.5rem 0',
  },
  buttonContainer: {
    padding: '1rem 0.75rem',
  },
}));

export default function HistoryList() {
  const { classes } = useStyles();

  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const inputRef = useInputRefStore((state) => state.inputRef);
  const setSelected = useHistoryStore((state) => state.setSelected);

  const newJourneyHandler = () => {
    if (!inputRef) {
      return;
    }
    inputRef.focus();
    setSelected(null);
  };

  if (!journeys) {
    return (
      <Center>
        <Loader role='alert' aria-label='Loading history' aria-live='assertive' />
      </Center>
    );
  }

  if (journeys.length === 0) {
    return (
      <Box className={classes.buttonContainer}>
        <Button fullWidth leftIcon={<IconPlus size='1rem' />} onClick={newJourneyHandler}>
          Start new journey
        </Button>
      </Box>
    );
  }

  return (
    <Flex className={classes.container}>
      {journeys.map((journey) => (
        <HistoryListItem key={journey.id} journey={journey} />
      ))}
    </Flex>
  );
}
