import { ActionIcon, Group, NavLink, Stack, Switch, Text, Tooltip, createStyles } from '@mantine/core';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { IconCheck, IconTrashX, IconX } from '@tabler/icons-react';

import { Journey } from 'types/common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/nodes';

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

  const { selected, setSelected, removeJourney } = useHistoryStore(
    (state) => ({ selected: state.selected, setSelected: state.setSelected, removeJourney: state.removeJourney }),
    shallow,
  );

  const isSelected = selected?.id === journey.id;
  const { classes } = useStyles();

  const [paths, setPaths] = useState(new Set<string>(journey.goalIds));
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

  const jNodes = useNodeStore((state) => state.jNodes);

  const { updateNodesWithGoals } = useNodeStore(
    (state) => ({ updateNodesWithGoals: state.updateNodesWithGoals }),
    shallow,
  );

  useEffect(() => {
    if (!isSelected) {
      setDeleteMode(false);
      return;
    }
    updateNodesWithGoals(Array.from(paths));
  }, [isSelected, paths, updateNodesWithGoals]);

  const promptClickHandler = () => {
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
    const newPaths = new Set(paths);
    if (e.target.checked) {
      newPaths.add(e.target.value);
    } else {
      newPaths.delete(e.target.value);
    }
    setPaths(newPaths);
    updateNodesWithGoals(Array.from(newPaths));
  };

  const expandHandler = (newIsOpened: boolean) => {
    if (!isSelected && isOpen) {
      return;
    }
    setIsOpen(newIsOpened);
  };

  return (
    <Tooltip label={journey.prompt.label} key={journey.id} openDelay={500}>
      <NavLink
        classNames={{
          children: classes.listItemChildren,
          root: classes.listItemRoot,
        }}
        component='li'
        active={isSelected}
        onClick={promptClickHandler}
        label={
          <Group position='apart' noWrap>
            <Text truncate>{journey.prompt.label}</Text>
            {isSelected && !deleteMode && (
              <ActionIcon color='blue' onClick={removeClickHandler} size={20}>
                <IconTrashX />
              </ActionIcon>
            )}
            {deleteMode && (
              <Group spacing={4}>
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
        {journey.goalIds.length > 1 && (
          <Stack className={classes.switchContainer}>
            {journey.goalIds.map((goalId) => {
              const found = jNodes.get(goalId);
              if (!found) {
                return null;
              }
              return (
                <Switch
                  key={goalId}
                  label={found.name}
                  value={goalId}
                  checked={paths.has(goalId)}
                  onChange={(e) => switchToggleHandler(e)}
                />
              );
            })}
          </Stack>
        )}
      </NavLink>
    </Tooltip>
  );
}
