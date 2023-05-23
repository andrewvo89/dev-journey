import { AppShell, Autocomplete, Flex, Loader, Navbar, createStyles } from '@mantine/core';
import { ReactFlow, ReactFlowProvider } from 'reactflow';
import { useEffect, useState } from 'react';

import { ClientPrompt } from 'types/common';
import HistoryList from 'components/HistoryList';
import { Props } from 'pages';
import { promptResponseSchema } from 'schemas/common';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/nodes';
import { usePromptStore } from 'store/search';
import { v4 as uuidv4 } from 'uuid';

const useStyles = createStyles((theme, props: { isLoading: boolean }) => ({
  container: {
    height: '100vh',
  },
  autocomplete: {
    position: 'sticky',
    bottom: 32,
    width: '50%',
    boxShadow: theme.shadows.md,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  input: {
    backgroundColor: props.isLoading ? '#f1f3f5' : undefined,
    color: props.isLoading ? '#909296' : undefined,
    opacity: props.isLoading ? 0.6 : undefined,
    cursor: props.isLoading ? 'not-allowed' : undefined,
    pointer: props.isLoading ? 'events:none' : undefined,
  },
}));

export default function Home(props: Props) {
  const { initialEdges, initialNodes, initialJNodes, prompts } = props;
  const { edges, nodes, onEdgesChange, onNodesChange, initFlow, updateNodesWithGoals } = useNodeStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      initFlow: state.initFlow,
      updateNodesWithGoals: state.updateNodesWithGoals,
    }),
    shallow,
  );

  useEffect(() => {
    initFlow(initialJNodes, initialNodes, initialEdges);
  }, [initFlow, initialEdges, initialJNodes, initialNodes]);

  const addJourney = useHistoryStore((state) => state.addJourney);

  const { prompt, setPrompt } = usePromptStore(
    (state) => ({ prompt: state.prompt, setPrompt: state.setPrompt }),
    shallow,
  );

  const selected = useHistoryStore((state) => state.selected);

  const [isLoading, setIsLoading] = useState(false);

  const { classes } = useStyles({ isLoading });

  useEffect(() => {
    if (!selected) {
      return;
    }
    setPrompt(selected.prompt.label);
  }, [selected, setPrompt]);

  const itemSelectedHandler = async (prompt: ClientPrompt) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/prompts/${prompt.value}`, { method: 'POST' });
      const jsonResponse = await res.json();
      const { goalIds } = promptResponseSchema.parse(jsonResponse);
      updateNodesWithGoals(goalIds);
      addJourney({ id: uuidv4(), goalIds, prompt });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactFlowProvider>
      <AppShell
        navbar={
          <Navbar p='xs' width={{ base: 300 }}>
            {/* First section with normal height (depends on section content) */}
            <Navbar.Section>History</Navbar.Section>

            {/* Grow section will take all available space that is not taken by first and last sections */}
            <Navbar.Section grow>
              <HistoryList />
            </Navbar.Section>

            {/* Last section with normal height (depends on section content) */}
            <Navbar.Section>Last section</Navbar.Section>
          </Navbar>
        }
      >
        <Flex className={classes.container}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={(i) => i.fitView()}
            proOptions={{ hideAttribution: true }}
          />
        </Flex>
        <Autocomplete
          classNames={{ root: classes.autocomplete, input: classes.input }}
          placeholder='Prompt dev journey...'
          data={prompts}
          value={prompt}
          onChange={setPrompt}
          onItemSubmit={itemSelectedHandler}
          filter={(value, prompt: ClientPrompt) => prompt.label.toLowerCase().includes(value.toLowerCase())}
          dropdownPosition='flip'
          switchDirectionOnFlip
          readOnly={isLoading}
          rightSection={isLoading ? <Loader size='sm' /> : undefined}
          size='lg'
        />
      </AppShell>
    </ReactFlowProvider>
  );
}
