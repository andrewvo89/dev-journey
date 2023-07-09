import { Flex, createStyles } from '@mantine/core';
import { NodeTypes, ReactFlow, useReactFlow } from 'reactflow';
import { getBoundsOfNodes, isJnodeNodeType } from 'utils/flow';

import FallbackNode from 'components/Nodes/FallbackNode';
import RootNode from 'components/Nodes/RootNode';
import { shallow } from 'zustand/shallow';
import { useBookmarkCtxMenuStore } from 'store/bookmark-context-menu';
import { useEffect } from 'react';
import { useGraphCtxMenuStore } from 'store/graph-context-menu';
import { useHistoryCtxMenuStore } from 'store/history-context-menu';
import { useNodeStore } from 'store/node';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
    flex: 1,
  },
}));

const nodeTypes: NodeTypes = {
  fallback: FallbackNode,
  root: RootNode,
};

export function Graph() {
  const { edges, nodes } = useNodeStore((state) => ({ nodes: state.nodes, edges: state.edges }), shallow);

  const { classes } = useStyles();
  const { fitView, fitBounds, zoomOut } = useReactFlow();
  const setGraphCtxMenuOpen = useGraphCtxMenuStore((state) => state.setIsOpen);
  const setHistoryCtxMenuOpen = useHistoryCtxMenuStore((state) => state.setIsOpen);
  const setBookmarkCtxMenuOpen = useBookmarkCtxMenuStore((state) => state.setIsOpen);

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

  const closeContextMenus = () => {
    setGraphCtxMenuOpen(null);
    setHistoryCtxMenuOpen(null);
    setBookmarkCtxMenuOpen(null);
  };

  return (
    <Flex className={classes.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onMoveStart={closeContextMenus}
        onInit={({ fitBounds, fitView }) => {
          const root = nodes.find((node) => node.type === 'root');
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
