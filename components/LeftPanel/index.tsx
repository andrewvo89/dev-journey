import { Divider, Navbar, createStyles } from '@mantine/core';

import BottomSection from 'components/LeftPanel/BottomSection';
import { MiddleSection } from 'components/LeftPanel/MiddleSection';
import { TopSection } from 'components/LeftPanel/TopSection';
import { useHistoryStore } from 'store/history';

const useStyles = createStyles((theme) => ({
  navbar: {
    width: 300,
    [theme.fn.smallerThan('md')]: {
      width: 200,
    },
    [theme.fn.smallerThan('sm')]: {
      width: 150,
    },
  },
  topSection: {
    padding: '1rem',
  },
  middleSection: {
    overflowY: 'auto',
  },
}));

export default function LeftPanel() {
  const { classes } = useStyles();

  const setSelected = useHistoryStore((state) => state.setSelected);

  const outsideClickHandler = () => {
    setSelected(null);
  };

  return (
    <Navbar role='navigation' aria-label='Sidebar' className={classes.navbar} width={{ base: 300 }}>
      <Navbar.Section role='region' aria-label='Top section' className={classes.topSection}>
        <TopSection />
      </Navbar.Section>
      <Divider />
      <Navbar.Section
        role='region'
        aria-label='Middle section'
        grow
        onClick={outsideClickHandler}
        className={classes.middleSection}
      >
        <MiddleSection />
      </Navbar.Section>
      <Navbar.Section role='region' aria-label='Bottom section'>
        <BottomSection />
      </Navbar.Section>
    </Navbar>
  );
}
