import { Divider, Navbar, createStyles } from '@mantine/core';

import BottomSection from 'components/LeftPanel/BottomSection';
import { MiddleSection } from 'components/LeftPanel/MiddleSection';
import { TopSection } from 'components/LeftPanel/TopSection';
import { useHistoryStore } from 'store/history';
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
  const inputRef = useInputRefStore((state) => state.inputRef);

  const outsideClickHandler = () => {
    setSelected(null);
  };

  const newJourneyHandler = () => {
    if (!inputRef) {
      return;
    }
    inputRef.focus();
    setSelected(null);
  };

  return (
    <Navbar className={classes.navbar} width={{ base: 300 }}>
      <Navbar.Section className={classes.topSection}>
        <TopSection newJourneyHandler={newJourneyHandler} />
      </Navbar.Section>
      <Divider />
      <Navbar.Section grow onClick={outsideClickHandler} className={classes.middleSection}>
        <MiddleSection newJourneyHandler={newJourneyHandler} />
      </Navbar.Section>
      <Navbar.Section>
        <BottomSection />
      </Navbar.Section>
    </Navbar>
  );
}
