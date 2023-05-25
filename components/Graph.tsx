import { Flex, createStyles } from '@mantine/core';
import { NodeTypes, ReactFlow, useReactFlow } from 'reactflow';
import { getBoundsOfNodes, isJnodeNodeType } from 'utils/flow';

import JNodeType from 'components/JNodeType';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { useNodeStore } from 'store/nodes';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
    flex: 1,
  },
}));

const nodeTypes: NodeTypes = {
  jnode: JNodeType,
};

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
  const { fitView, fitBounds, zoomOut } = useReactFlow();

  useEffect(() => {
    const nodesOnPath = nodes.filter((node) => isJnodeNodeType(node) && node.data.isOnPath);
    if (nodesOnPath.length === 0) {
      fitView({ duration: 1000 });
      return;
    }
    const bounds = getBoundsOfNodes(nodesOnPath);
    fitBounds(bounds, { duration: 1000 });
  }, [nodes, fitView, fitBounds, zoomOut]);

  return (
    <Flex className={classes.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={({ fitBounds, fitView }) => {
          const root = nodes.find((node) => node.id === 'root');
          if (!root?.width || !root?.height) {
            fitView({ duration: 1000 });
            return;
          }
          fitBounds(
            { x: root.position.x, y: root.position.y, width: root.width, height: root.height },
            { duration: 1000 },
          );
        }}
        proOptions={{ hideAttribution: true }}
        nodeTypes={nodeTypes}
      />
    </Flex>
  );
}
