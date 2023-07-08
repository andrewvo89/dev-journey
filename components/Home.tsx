import { Flex, createStyles } from '@mantine/core';
import { getLayoutedElements, jnodesToFlow } from 'utils/flow';

import { Graph } from 'components/Graph';
import LeftPanel from 'components/LeftPanel';
import PromptBar from 'components/PromptBar';
import { Props } from 'pages';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';
import { usePromptStore } from 'store/prompt';
import { useSyncSpotlight } from 'hooks/useSyncSpotlight';

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
  const { placeholder, prompts, initialJNodes } = props;
  useSyncSpotlight();

  const { initFlow, updateNodes } = useNodeStore(
    (state) => ({ initFlow: state.initFlow, updateNodes: state.updateNodes }),
    shallow,
  );
  const setPrompts = usePromptStore((state) => state.setPrompts);
  const selected = useHistoryStore((state) => state.selected);

  const { classes } = useStyles();

  // Store initial values in store
  useEffect(() => {
    const { nodes, edges } = jnodesToFlow({
      jnodes: initialJNodes,
      destinationIds: [],
      maintainSettings: new Map(),
      nodesIdsOnPath: [],
      optionalIdsOnPath: [],
    });
    const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, 'LR');
    initFlow(initialJNodes, initialNodes, initialEdges);
    setPrompts(prompts);
  }, [initFlow, initialJNodes, prompts, setPrompts]);

  useEffect(() => {
    setPrompts(prompts);
  }, [prompts, setPrompts]);

  // Update nodes when selected updates
  useEffect(() => {
    if (!selected) {
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
