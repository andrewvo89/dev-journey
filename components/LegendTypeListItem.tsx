import { DefaultMantineColor, Group, Paper, Text, createStyles } from '@mantine/core';

import { JNodeType } from 'types/common';
import { jnodeTypeMap } from 'utils/node';

type StyleProps = {
  color: DefaultMantineColor;
};

const useStyles = createStyles((theme, props: StyleProps) => ({
  keyName: {
    whiteSpace: 'nowrap',
  },
  keyBox: {
    backgroundColor: `${theme.colors[props.color][5]}`,
    width: '1rem',
    height: '1rem',
  },
}));

type Props = {
  type: JNodeType;
};

export default function LegendTypeListItem(props: Props) {
  const { type } = props;
  const { label, color } = jnodeTypeMap[type];
  const { classes } = useStyles({ color });
  return (
    <Group noWrap grow={false}>
      <Paper shadow='sm' className={classes.keyBox}></Paper>
      <Text className={classes.keyName}>{label}</Text>
    </Group>
  );
}
