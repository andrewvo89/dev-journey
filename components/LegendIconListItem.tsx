import { Group, Text, ThemeIcon } from '@mantine/core';

type Props = {
  name: string;
  icon: JSX.Element;
  classNames: {
    text: string;
  };
};

export function LegendIconListItem(props: Props) {
  const { name, icon, classNames } = props;

  return (
    <Group noWrap grow={false}>
      <ThemeIcon size='1rem'>{icon}</ThemeIcon>
      <Text className={classNames.text}>{name}</Text>
    </Group>
  );
}
