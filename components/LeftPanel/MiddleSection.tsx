import { Accordion, Button, Container, createStyles } from '@mantine/core';
import { IconHistory, IconKey, IconPlus } from '@tabler/icons-react';

import HistoryList from 'components/HistoryList';
import { LegendList } from 'components/LegendList';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';

const useStyles = createStyles(() => ({
  historyContainer: {
    padding: 0,
  },
  accordianPanel: {
    padding: '.5rem',
  },
}));

type Props = {
  newJourneyHandler: () => void;
};

export function MiddleSection(props: Props) {
  const { newJourneyHandler } = props;
  const journeys = useHydratedStore(useHistoryStore, (state) => state.journeys);
  const { classes } = useStyles();

  return (
    <Accordion multiple defaultValue={['history']} classNames={{ content: classes.accordianPanel }}>
      <Accordion.Item value='legend'>
        <Accordion.Control icon={<IconKey />}>Legend</Accordion.Control>
        <Accordion.Panel className={classes.accordianPanel}>
          <LegendList />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value='history'>
        <Accordion.Control icon={<IconHistory />}>History</Accordion.Control>
        <Accordion.Panel>
          <Container className={classes.historyContainer}>
            {journeys?.length === 0 && (
              <Button fullWidth leftIcon={<IconPlus size='1rem' />} onClick={newJourneyHandler}>
                Start new journey
              </Button>
            )}
            <HistoryList />
          </Container>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
