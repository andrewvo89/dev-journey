import { Container, createStyles } from '@mantine/core';

import BookmarksList from 'components/LeftPanel/BookmarksList';
import HistoryList from 'components/LeftPanel/HistoryList';
import { LegendList } from 'components/LeftPanel/LegendList';
import { useTabStore } from 'store/tab';

const useStyles = createStyles(() => ({
  container: {
    padding: '0',
  },
}));

export function MiddleSection() {
  const tab = useTabStore((state) => state.tab);
  const { classes } = useStyles();

  return (
    <Container className={classes.container}>
      {tab === 'history' && <HistoryList />}
      {tab === 'bookmarks' && <BookmarksList />}
      {tab === 'info' && <LegendList />}
    </Container>
  );
}
