import { Flex, createStyles } from '@mantine/core';

import { ReactFlow } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useNodeStore } from 'store/nodes';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
  },
}));

export function Graph() {
  const { edges, nodes, onEdgesChange, onNodesChange } = useNodeStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
    }),
    shallow,
  );

  const { classes } = useStyles();

  return (
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
  );
}
