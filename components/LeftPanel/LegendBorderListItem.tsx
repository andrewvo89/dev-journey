import { Group, Paper, Text, createStyles } from '@mantine/core';

type Props = {
  name: string;
  paperClassName: 'onPath' | 'notOnPath' | 'extendedPath';
};

const useStyles = createStyles((theme) => ({
  text: {
    whiteSpace: 'nowrap',
  },
  container: {
    padding: '0.5rem 0.75rem',
  },
  borderLegend: {
    borderWidth: 1,
    width: '1rem',
    height: '1rem',
  },
  onPath: {
    borderColor: theme.colors.blue[6],
    borderStyle: 'solid',
  },
  extendedPath: {
    borderStyle: 'dashed',
    borderColor: theme.colors.blue[6],
  },
  notOnPath: {
    borderStyle: 'solid',
    borderColor: theme.colors.gray[6],
    opacity: 0.2,
  },
}));

export function LegendBorderListItem(props: Props) {
  const { name, paperClassName } = props;
  const { classes } = useStyles();

  return (
    <Group noWrap grow={false} className={classes.container}>
      <Paper shadow='sm' className={`${classes.borderLegend} ${classes[paperClassName]}`}></Paper>
      <Text className={classes.text}>{name}</Text>
    </Group>
  );
}
