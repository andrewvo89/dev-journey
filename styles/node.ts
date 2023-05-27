import { JNode } from 'types/common';
import { createStyles } from '@mantine/core';
import { getNodeColor } from 'utils/node';
import { jnodeProps } from 'types/flow';

type Props = {
  type: JNode['type'];
  keepAlive: boolean;
  isOptional: boolean;
  isOnPath: boolean;
};

export const useNodeStyles = createStyles((theme, props: Props) => {
  const { keepAlive, isOptional, isOnPath, type } = props;
  const backgroundColor = getNodeColor(type, theme);

  return {
    paper: {
      width: jnodeProps.dimensions.width,
      height: jnodeProps.dimensions.height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isOptional ? 0.6 : keepAlive ? 1 : 0.2,
      borderWidth: 1,
      borderStyle: isOptional ? 'dashed' : 'solid',
      borderColor: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
      color: theme.colors.gray[0],
      backgroundColor,
    },
    handle: {
      '&&': {
        opacity: keepAlive ? 1 : 0.1,
        backgroundColor: isOnPath ? theme.colors.blue[6] : theme.colors.gray[6],
      },
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
      transform: 'translate(50%, -50%)',
      border: `1px solid ${isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6]}`,
      color: theme.colors.gray[isOptional ? 6 : 7],
      backgroundColor: theme.white,
      zIndex: 1,
    },
  };
});
