import { Autocomplete, Flex, Loader, createStyles } from '@mantine/core';
import { Edge, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import { NodeData, NodeWithData } from 'types/flow';

import { ClientPrompt } from 'types/common';
import { Props } from 'pages';
import { getPathsToNode } from 'utils/jnodes';
import { highlightEdges } from 'utils/flow';
import { useState } from 'react';

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
  const { initialEdges, initialNodes, prompts } = props;

  const [nodes, , onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { classes } = useStyles({ isLoading });

  const nodeClickHandler = (node: NodeWithData) => {
    const flatNodePaths = getPathsToNode(node.data.jNode);
    const newEdges = flatNodePaths.reduce<Edge[]>((list, path) => highlightEdges(list, path), initialEdges);
    setEdges(newEdges);
  };

  const itemSelectedHandler = async (prompt: ClientPrompt) => {
    setSearchTerm(prompt.label);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/prompts/${prompt.value}`, { method: 'POST' });
      const { edges } = await res.json();
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
          onNodeClick={(_e, node) => nodeClickHandler(node)}
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
