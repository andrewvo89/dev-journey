import { JNodeType } from 'types/jnode';
import { createStyles } from '@mantine/core';
import { jnodeProps } from 'types/flow';
import { jnodeTypeMap } from 'utils/jnode';

type StyleProps = {
  type: JNodeType;
  keepAlive: boolean;
  isOptional: boolean;
  isOnPath: boolean;
};

export const useStyles = createStyles((theme, props: StyleProps) => {
  const { keepAlive, isOptional, isOnPath, type } = props;

  return {
    paper: {
      width: jnodeProps.dimensions.width,
      height: jnodeProps.dimensions.height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isOptional ? 0.75 : keepAlive ? 1 : 0.2,
      borderWidth: 1,
      borderStyle: isOptional ? 'dashed' : 'solid',
      borderColor: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
      color: theme.colors.gray[0],
      backgroundColor: theme.colors[jnodeTypeMap[type].color][5],
      boxShadow: keepAlive ? theme.shadows.sm : undefined,
      transition: 'all .2s ease-in-out',
      ':hover': {
        boxShadow: keepAlive ? theme.shadows.xl : undefined,
        transform: keepAlive ? 'scale(1.1)' : undefined,
      },
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
      color: isOnPath || isOptional ? theme.colors.blue[6] : theme.colors.gray[6],
      backgroundColor: theme.white,
      zIndex: 1,
    },
    crownIcon: {
      width: '2rem',
      height: '2rem',
      position: 'absolute',
      left: '-1rem',
    },
    rocketIcon: {
      width: '2rem',
      height: '2rem',
      position: 'absolute',
      left: '-1rem',
    },
    overlay: {
      zIndex: 1001,
    },
    inner: {
      zIndex: 1002,
    },
  };
});
