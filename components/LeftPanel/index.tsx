import {
  Center,
  Divider,
  Navbar,
  SegmentedControl,
  SegmentedControlItem,
  Space,
  Text,
  createStyles,
} from '@mantine/core';
import { IconBookmarks, IconHistory, IconInfoCircle } from '@tabler/icons-react';

import BottomSection from 'components/LeftPanel/BottomSection';
import { MiddleSection } from 'components/LeftPanel/MiddleSection';
import { TopSection } from 'components/LeftPanel/TopSection';
import { useTabStore } from 'store/tab';

type LabelProps = {
  icon: React.ReactNode;
  label: string;
};

function Label(props: LabelProps) {
  const { icon, label } = props;

  return (
    <Center>
      {icon}
      <Space w='xs' />
      <Text>{label}</Text>
    </Center>
  );
}

export type TabKey = 'history' | 'bookmarks' | 'info';

type TypedSegmentedControlItem = SegmentedControlItem & { value: TabKey };

const tabs: TypedSegmentedControlItem[] = [
  { label: <Label icon={<IconHistory size='1rem' />} label='History' />, value: 'history' },
  { label: <Label icon={<IconBookmarks size='1rem' />} label='Bookmarks' />, value: 'bookmarks' },
  { label: <Label icon={<IconInfoCircle size='1rem' />} label='Info' />, value: 'info' },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    width: 400,
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
  const { tab, setTab } = useTabStore();

  return (
    <Navbar role='navigation' aria-label='Sidebar' className={classes.navbar}>
      <Navbar.Section role='region' aria-label='Top section' className={classes.topSection}>
        <TopSection />
      </Navbar.Section>
      <Divider />
      <Navbar.Section role='region' aria-label='Tabs'>
        <SegmentedControl value={tab} onChange={setTab} data={tabs} fullWidth />
      </Navbar.Section>
      <Navbar.Section role='region' aria-label='Middle section' grow className={classes.middleSection}>
        <MiddleSection />
      </Navbar.Section>
      <Navbar.Section role='region' aria-label='Bottom section'>
        <BottomSection />
      </Navbar.Section>
    </Navbar>
  );
}
