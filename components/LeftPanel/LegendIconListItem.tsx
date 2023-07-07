import { Group, Text, ThemeIcon, createStyles } from '@mantine/core';

type Props = {
  name: string;
  icon: JSX.Element;
};

const useStyles = createStyles(() => ({
  container: {
    padding: '0.5rem 0.75rem',
  },
  text: {
    whiteSpace: 'nowrap',
  },
}));

export function LegendIconListItem(props: Props) {
  const { name, icon } = props;
  const { classes } = useStyles();

  return (
    <Group noWrap grow={false} className={classes.container}>
      <ThemeIcon size='1rem'>{icon}</ThemeIcon>
      <Text className={classes.text}>{name}</Text>
    </Group>
  );
}
