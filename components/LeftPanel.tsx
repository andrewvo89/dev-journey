import { Navbar, createStyles } from '@mantine/core';

import HistoryList from 'components/HistoryList';

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
  return (
    <Navbar className={classes.navbar} width={{ base: 300 }}>
      <Navbar.Section>History</Navbar.Section>
      <Navbar.Section grow>
        <HistoryList />
      </Navbar.Section>
      <Navbar.Section>Last section</Navbar.Section>
    </Navbar>
  );
}