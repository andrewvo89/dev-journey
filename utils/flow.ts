import { Edge, Node, Position } from 'reactflow';

import { JNode } from 'types/common';
import dagre from 'dagre';

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const nodeWidth = 172;
  const nodeHeight = 36;
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const highlightEdges = (edges: Edge[], jNodes: JNode[]): Edge[] => {
  const currentEdges = edges.reduce<Map<string, Edge>>((map, edge) => {
    const newMap = new Map(map);
    return newMap.set(edge.id, edge);
  }, new Map());

  const updatedEdges = jNodes.reduce<Map<string, Edge>>((map, node, index, arr) => {
    if (index === arr.length - 1) {
      return map;
    }
    const newMap = new Map(map);
    const nextNode = arr[index + 1];
    const id = `${nextNode.id}-${node.id}`;

    newMap.set(id, {
      id,
      source: node.id,
      target: nextNode.id,
      animated: true,
      style: { stroke: '#f00000' },
      type: 'default',
    });

    return newMap;
  }, currentEdges);

  return Array.from(updatedEdges.values());
};
