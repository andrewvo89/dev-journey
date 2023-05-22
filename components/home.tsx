import { Autocomplete, Flex, Loader, createStyles } from '@mantine/core';
import { ChangeEvent, forwardRef, useState } from 'react';
import { Edge, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import { NodeData, NodeWithData } from 'types/flow';

import { ClientPrompt } from 'types/common';
import { Props } from 'pages';
import { getPathsToNode } from 'utils/jnodes';
import { highlightEdges } from 'utils/flow';

const useStyles = createStyles((_, props: { isLoading: boolean }) => ({
  autocomplete: {
    width: '50%',
    shadow: 'lg',
    size: 'md',
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

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
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
      const { nodes, edges } = await res.json();
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
      <Flex w='100vw' h='100vh'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_e, node) => nodeClickHandler(node)}
          onInit={(i) => i.fitView()}
        />
      </Flex>
      <Flex pos='absolute' bottom={32} w='100%' direction='column' align='center'>
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
        />
      </Flex>
    </ReactFlowProvider>
  );
}
