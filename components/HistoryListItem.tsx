import { ChangeEvent, useEffect, useState } from 'react';
import { NavLink, Switch, Text, Tooltip, createStyles } from '@mantine/core';

import { Journey } from 'types/common';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/nodes';

type Props = {
  journey: Journey;
};

const useStyles = createStyles(() => ({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
}));

export default function HistoryListItem(props: Props) {
  const { journey } = props;

  const { selected, setSelected } = useHistoryStore(
    (state) => ({ selected: state.selected, setSelected: state.setSelected }),
    shallow,
  );

  const isSelected = selected?.id === journey.id;
  const { classes } = useStyles();

  const [paths, setPaths] = useState(new Set<string>(journey.goalIds));
  const [isOpen, setIsOpen] = useState(false);

  const jNodes = useNodeStore((state) => state.jNodes);

  const { updateNodesWithGoals } = useNodeStore(
    (state) => ({ updateNodesWithGoals: state.updateNodesWithGoals }),
    shallow,
  );

  useEffect(() => {
    if (!isSelected) {
      return;
    }
    updateNodesWithGoals(Array.from(paths));
  }, [isSelected, paths, updateNodesWithGoals]);

  const buttonClickHandler = (journey: Journey) => {
    setSelected(journey);
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
          children: classes.listItem,
        }}
        active={isSelected}
        onClick={() => buttonClickHandler(journey)}
        label={<Text truncate>{journey.prompt.label}</Text>}
        opened={isOpen}
        onChange={expandHandler}
      >
        {journey.goalIds.length > 1 &&
          journey.goalIds.map((goalId) => {
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
      </NavLink>
    </Tooltip>
  );
}
