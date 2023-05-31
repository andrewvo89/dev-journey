import { ActionIcon, Group, NavLink, Stack, Switch, Text, Tooltip, createStyles } from '@mantine/core';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { IconCheck, IconTrashX, IconX } from '@tabler/icons-react';

import { Journey } from 'types/common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';

dayjs.extend(relativeTime);

type Props = {
  journey: Journey;
};

const useStyles = createStyles(() => ({
  listItemChildren: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  listItemRoot: {
    borderRadius: 8,
  },
  switchContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
}));

export default function HistoryListItem(props: Props) {
  const { journey } = props;

  const { selected, setSelected, removeJourney, selectPath, deselectPath } = useHistoryStore(
    (state) => ({
      selected: state.selected,
      setSelected: state.setSelected,
      removeJourney: state.removeJourney,
      selectPath: state.selectPath,
      deselectPath: state.deselectPath,
    }),
    shallow,
  );

  const isSelected = selected?.id === journey.id;
  const { classes } = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [relativeTime, setRelativeTime] = useState(dayjs().to(dayjs(journey.createdAt)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setRelativeTime(dayjs().to(dayjs(journey.createdAt)));
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [journey.createdAt]);

  const jnodes = useNodeStore((state) => state.jnodes);

  useEffect(() => {
    if (!isSelected) {
      setIsOpen(false);
      setDeleteMode(false);
      return;
    }
  }, [isSelected]);

  const linkClickHandler = () => {
    if (isSelected) {
      return;
    }
    setSelected(journey);
  };

  const removeClickHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    setDeleteMode(true);
  };

  const removeCancelHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    setDeleteMode(false);
  };

  const removeConfirmHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    removeJourney(journey);
  };

  const switchToggleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectPath(journey, e.target.value);
    } else {
      deselectPath(journey, e.target.value);
    }
  };

  const expandHandler = (newIsOpened: boolean) => {
    if (!isSelected && isOpen) {
      return;
    }
    setIsOpen(newIsOpened);
  };

  return (
    <Tooltip label={journey.prompt.label} openDelay={500}>
      <NavLink
        classNames={{
          children: classes.listItemChildren,
          root: classes.listItemRoot,
        }}
        component='li'
        active={isSelected}
        onClick={linkClickHandler}
        label={
          <Group position='apart' noWrap>
            <Text truncate>{journey.prompt.label}</Text>
            {isSelected && !deleteMode && (
              <ActionIcon color='blue' onClick={removeClickHandler} size={20}>
                <IconTrashX />
              </ActionIcon>
            )}
            {deleteMode && (
              <Group spacing={4} noWrap>
                <ActionIcon color='blue' onClick={removeConfirmHandler} size={20}>
                  <IconCheck />
                </ActionIcon>
                <ActionIcon color='blue' onClick={removeCancelHandler} size={20}>
                  <IconX />
                </ActionIcon>
              </Group>
            )}
          </Group>
        }
        description={relativeTime}
        opened={isOpen}
        onChange={expandHandler}
      >
        {journey.destinations.length > 1 && (
          <Stack className={classes.switchContainer}>
            {journey.destinations.map((path) => {
              const found = jnodes.get(path.id);
              if (!found) {
                return null;
              }
              return (
                <Switch
                  key={path.id}
                  label={found.name}
                  value={path.id}
                  checked={path.enabled}
                  onChange={switchToggleHandler}
                />
              );
            })}
          </Stack>
        )}
      </NavLink>
    </Tooltip>
  );
}
