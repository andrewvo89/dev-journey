import { Accordion, Button, Container, createStyles } from '@mantine/core';
import { IconHistory, IconKey, IconPlus } from '@tabler/icons-react';

import HistoryList from 'components/LeftPanel/HistoryList';
import { LegendList } from 'components/LegendList';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useInputRefStore } from 'store/input-ref';

const useStyles = createStyles(() => ({
  historyContainer: {
    padding: 0,
  },
  accordianPanel: {
    padding: '.5rem',
  },
}));

export function MiddleSection() {
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const inputRef = useInputRefStore((state) => state.inputRef);
  const setSelected = useHistoryStore((state) => state.setSelected);
  const { classes } = useStyles();

  const newJourneyHandler = () => {
    if (!inputRef) {
      return;
    }
    inputRef.focus();
    setSelected(null);
  };

  return (
    <Accordion multiple defaultValue={['history']} classNames={{ content: classes.accordianPanel }}>
      <Accordion.Item value='key'>
        <Accordion.Control aria-label='Key' icon={<IconKey />}>
          Key
        </Accordion.Control>
        <Accordion.Panel aria-label='Key' className={classes.accordianPanel}>
          <LegendList />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value='history'>
        <Accordion.Control aria-label='History' icon={<IconHistory />}>
          History
        </Accordion.Control>
        <Accordion.Panel aria-label='History' className={classes.accordianPanel}>
          <Container className={classes.historyContainer}>
            {!journeys ||
              (journeys.length === 0 && (
                <Button fullWidth leftIcon={<IconPlus size='1rem' />} onClick={newJourneyHandler}>
                  Start new journey
                </Button>
              ))}
            <HistoryList />
          </Container>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
