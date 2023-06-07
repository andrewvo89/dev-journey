import { Flex, createStyles } from '@mantine/core';

import { Graph } from 'components/Graph';
import LeftPanel from 'components/LeftPanel';
import PromptBar from 'components/PromptBar';
import { Props } from 'pages';
import { useEffect } from 'react';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';
import { usePromptStore } from 'store/prompt';

const useStyles = createStyles(() => ({
  container: {
    flexDirection: 'row',
  },
  rightContainer: {
    flex: 1,
    position: 'relative',
  },
}));

export default function Home(props: Props) {
  const { initialEdges, initialNodes, initialJNodes, prompts, placeholder } = props;

  const initFlow = useNodeStore((state) => state.initFlow);
  const setPrompts = usePromptStore((state) => state.setPrompts);
  const updateNodes = useNodeStore((state) => state.updateNodes);
  const selected = useHistoryStore((state) => state.selected);

  const { classes } = useStyles();

  // Store initial values in store
  useEffect(() => {
    initFlow(initialJNodes, initialNodes, initialEdges);
    setPrompts(prompts);
  }, [initFlow, initialEdges, initialJNodes, initialNodes, prompts, setPrompts]);

  // Update nodes when selected updates
  useEffect(() => {
    if (!selected) {
      updateNodes([]);
      return;
    }
    updateNodes(selected.destinations);
  }, [selected, updateNodes]);

  return (
    <Flex className={classes.container} role='main' aria-label='Main container'>
      <LeftPanel />
      <Flex className={classes.rightContainer} role='region' aria-label='Right container'>
        <Graph />
        <PromptBar placeholder={placeholder} />
      </Flex>
    </Flex>
  );
}
