import { Flex, createStyles } from '@mantine/core';
import { NodeTypes, ReactFlow, Rect, useReactFlow } from 'reactflow';

import JNodeType from 'components/JNodeType';
import { isJnodeNodeType } from 'utils/flow';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { useNodeStore } from 'store/nodes';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
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
  const { setCenter, fitView } = useReactFlow();

  useEffect(() => {
    const nodesOnPath = nodes.filter((node) => isJnodeNodeType(node) && node.data.isOnPath);
    if (nodesOnPath.length === 0) {
      fitView({ duration: 1000 });
      return;
    }
    const bounds = nodesOnPath.reduce<Rect>(
      (acc, node) => {
        if (node.position.x < acc.x) {
          acc.x = node.position.x;
        }
        if (node.position.y < acc.y) {
          acc.y = node.position.y;
        }
        if (node.width && node.position.x + node.width > acc.width) {
          acc.width = node.position.x + node.width;
        }
        if (node.height && node.position.y + node.height > acc.height) {
          acc.height = node.position.y + node.height;
        }
        return acc;
      },
      { x: 0, y: 0, width: 0, height: 0 },
    );
    setCenter(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, { duration: 1000, zoom: 0.9 });
  }, [setCenter, nodes, fitView]);

  return (
    <Flex className={classes.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={(i) => i.fitView({ duration: 1000 })}
        proOptions={{ hideAttribution: true }}
        nodeTypes={nodeTypes}
      />
    </Flex>
  );
}
