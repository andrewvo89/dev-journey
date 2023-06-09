import { Center, Flex, Loader, createStyles } from '@mantine/core';

import HistoryListItem from 'components/LeftPanel/HistoryListItem';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';

const useStyles = createStyles(() => ({
  list: {
    flexDirection: 'column',
  },
}));

export default function HistoryList() {
  const { classes } = useStyles();

  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);

  const cancelPropagation = (e: React.MouseEvent) => e.stopPropagation();

  if (!journeys) {
    return (
      <Center onClick={cancelPropagation}>
        <Loader role='alert' aria-label='Loading history' aria-live='assertive' />
      </Center>
    );
  }

  return (
    <Flex role='menu' aria-label='History' className={classes.list} onClick={cancelPropagation}>
      {journeys.map((journey) => (
        <HistoryListItem key={journey.id} journey={journey} />
      ))}
    </Flex>
  );
}
