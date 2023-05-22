import { Autocomplete, Flex, Loader, createStyles } from '@mantine/core';
import { ClientPrompt, JNode } from 'types/common';
import { Node, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import { useMemo, useState } from 'react';

import { NodeData } from 'types/flow';
import { Props } from 'pages';
import { getPathsToNode } from 'utils/jnodes';
import { jNodesToFlow } from 'utils/flow';
import { promptResponseSchema } from 'schemas/common';

const useStyles = createStyles((theme, props: { isLoading: boolean }) => ({
  container: {
    width: '100vw',
    height: '100vh',
  },
  autocomplete: {
    position: 'absolute',
    bottom: 32,
    width: '50%',
    boxShadow: theme.shadows.md,
    size: 'md',
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

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paths, setPaths] = useState<JNode[][][]>([]);

  const jNodesMap = useMemo<Map<string, JNode>>(
    () => initialJNodes.reduce<Map<string, JNode>>((map, jNode) => map.set(jNode.id, jNode), new Map()),
    [initialJNodes],
  );

  const nodeSettingsMap = useMemo(
    () =>
      nodes.reduce<Map<string, Partial<Node>>>(
        (map, node) =>
          map.set(node.id, {
            position: node.position,
            sourcePosition: node.sourcePosition,
            targetPosition: node.targetPosition,
          }),
        new Map(),
      ),
    [nodes],
  );

  const { classes } = useStyles({ isLoading });

  const itemSelectedHandler = async (prompt: ClientPrompt) => {
    setSearchTerm(prompt.label);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/prompts/${prompt.value}`, { method: 'POST' });
      const jsonResponse = await res.json();
      console.log('jsonResponse', jsonResponse);
      const { goalIds } = promptResponseSchema.parse(jsonResponse);

      const goalJNodes = goalIds.reduce<JNode[]>((list, id) => {
        const found = jNodesMap.get(id);
        if (found) {
          list.push(found);
        }
        return list;
      }, []);

      const paths = goalJNodes.map((goal) => getPathsToNode(goal));
      setPaths(paths);
      const nodesOnPath = paths.flatMap((path) => path.reduce((list, p) => [...list, ...p], []));
      const { edges, nodes } = jNodesToFlow(initialJNodes, nodesOnPath, nodeSettingsMap);
      setNodes(nodes);
      setEdges(edges);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactFlowProvider>
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
        value={searchTerm}
        onChange={setSearchTerm}
        onItemSubmit={itemSelectedHandler}
        filter={(value, prompt: ClientPrompt) => prompt.label.toLowerCase().includes(value.toLowerCase())}
        dropdownPosition='flip'
        switchDirectionOnFlip
        readOnly={isLoading}
        rightSection={isLoading ? <Loader size='sm' /> : undefined}
        size='lg'
      />
    </ReactFlowProvider>
  );
}
