import { Flex, createStyles } from '@mantine/core';
import { NodeTypes, ReactFlow, useReactFlow } from 'reactflow';
import { getBoundsOfNodes, isJnodeNodeType } from 'utils/flow';

import JNodeTypeNode from 'components/JNodeTypeNode';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { useNodeStore } from 'store/node';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
    flex: 1,
  },
}));

const nodeTypes: NodeTypes = {
  jnode: JNodeTypeNode,
};

export function Graph() {
  const { edges, nodes } = useNodeStore((state) => ({ nodes: state.nodes, edges: state.edges }), shallow);

  const { classes } = useStyles();
  const { fitView, fitBounds, zoomOut } = useReactFlow();

  useEffect(() => {
    const nodesOnPath = nodes.filter((node) => isJnodeNodeType(node) && node.data.isDesNode);
    if (nodesOnPath.length === 0) {
      fitView({ duration: 1000 });
      return;
    }
    const bounds = getBoundsOfNodes(nodesOnPath, ['root']);
    const padding = 100;
    const width = bounds.xMax - bounds.xMin + padding;
    const height = bounds.yMax - bounds.yMin + padding;
    fitBounds({ x: bounds.xMin, y: bounds.yMin, width, height }, { duration: 1000 });
  }, [nodes, fitView, fitBounds, zoomOut]);

  return (
    <Flex className={classes.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        edgesFocusable={false}
        edgesUpdatable={false}
        elementsSelectable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        minZoom={0.01}
      />
    </Flex>
  );
}
