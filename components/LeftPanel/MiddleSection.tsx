import { Box, Container, createStyles } from '@mantine/core';

import BookmarksList from 'components/LeftPanel/BookmarksList';
import HistoryList from 'components/LeftPanel/HistoryList';
import { LegendList } from 'components/LeftPanel/LegendList';
import { ReactNode } from 'react';
import { useTabStore } from 'store/tab';

type DisplayContainerProps = {
  children: ReactNode;
  isHidden: boolean;
};

const useDisplayContainerStyles = createStyles((_, props: Pick<DisplayContainerProps, 'isHidden'>) => ({
  container: {
    display: props.isHidden ? 'none' : undefined,
  },
}));

function DisplayContainer(props: DisplayContainerProps) {
  const { children, isHidden } = props;
  const { classes } = useDisplayContainerStyles({ isHidden });
  return <Box className={classes.container}>{children}</Box>;
}

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
      <DisplayContainer isHidden={tab !== 'history'}>
        <HistoryList />
      </DisplayContainer>
      <DisplayContainer isHidden={tab !== 'bookmarks'}>
        <BookmarksList />
      </DisplayContainer>
      <DisplayContainer isHidden={tab !== 'info'}>
        <LegendList />
      </DisplayContainer>
    </Container>
  );
}
