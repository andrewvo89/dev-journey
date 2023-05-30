import { Group, Paper, Text } from '@mantine/core';

type Props = {
  name: string;
  classNames: {
    paper: string;
    text: string;
  };
};

export function LegendBorderListItem(props: Props) {
  const { name, classNames } = props;

  return (
    <Group noWrap grow={false}>
      <Paper shadow='sm' className={classNames.paper}></Paper>
      <Text className={classNames.text}>{name}</Text>
    </Group>
  );
}
