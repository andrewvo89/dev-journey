import { DefaultMantineColor, Group, Paper, Text, createStyles } from '@mantine/core';

import { JnodeType } from 'types/jnode';
import { jnodeTypeMap } from 'utils/jnode';

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
  type: JnodeType;
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
