import { Center, Flex, Loader, createStyles } from '@mantine/core';

import HistoryListItem from 'components/HistoryListItem';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';

const useStyles = createStyles(() => ({
  list: {
    gap: 8,
    flexDirection: 'column',
  },
}));

export default function HistoryList() {
  const { classes } = useStyles();

  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);

  if (!journeys) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Flex className={classes.list}>
      {journeys.map((journey) => (
        <HistoryListItem key={journey.id} journey={journey} />
      ))}
    </Flex>
  );
}
