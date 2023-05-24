import { AppShell } from '@mantine/core';
import { Graph } from 'components/Graph';
import LeftPanel from 'components/LeftPanel';
import PromptBar from 'components/PromptBar';
import { Props } from 'pages';
import { ReactFlowProvider } from 'reactflow';
import { useEffect } from 'react';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/nodes';
import { usePromptStore } from 'store/prompt';

export default function Home(props: Props) {
  const { initialEdges, initialNodes, initialJNodes, prompts } = props;

  const initFlow = useNodeStore((state) => state.initFlow);
  const setPrompts = usePromptStore((state) => state.setPrompts);
  const updateNodesWithGoals = useNodeStore((state) => state.updateNodesWithGoals);
  const selected = useHistoryStore((state) => state.selected);

  // Store initial values in store
  useEffect(() => {
    initFlow(initialJNodes, initialNodes, initialEdges);
    setPrompts(prompts);
  }, [initFlow, initialEdges, initialJNodes, initialNodes, prompts, setPrompts]);

  // Update nodes when selected updates
  useEffect(() => {
    updateNodesWithGoals(selected?.goalIds ?? []);
  }, [selected, updateNodesWithGoals]);

  return (
    <ReactFlowProvider>
      <AppShell navbar={<LeftPanel />}>
        <Graph />
        <PromptBar />
      </AppShell>
    </ReactFlowProvider>
  );
}
