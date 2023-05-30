import { ClientJNode, JNode } from 'types/common';
import { Edge, Node, Position, Rect } from 'reactflow';
import { JNodeTypeData, jnodeProps } from 'types/flow';

import dagre from 'dagre';

export function getLayoutedElements<TData>(nodes: Node<TData>[], edges: Edge[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: jnodeProps.dimensions.width, height: jnodeProps.dimensions.height });
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
      x: nodeWithPosition.x - jnodeProps.dimensions.width / 2,
      y: nodeWithPosition.y - jnodeProps.dimensions.height / 2,
    };

    return node;
  });

  return { nodes, edges };
}

export const highlightEdges = (edges: Edge[], jnodes: JNode[]): Edge[] => {
  const currentEdges = edges.reduce<Map<string, Edge>>((map, edge) => {
    const newMap = new Map(map);
    return newMap.set(edge.id, edge);
  }, new Map());

  const updatedEdges = jnodes.reduce<Map<string, Edge>>((map, node, index, arr) => {
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
      style: { stroke: '#228be6' },
      type: 'default',
    });

    return newMap;
  }, currentEdges);

  return Array.from(updatedEdges.values());
};

function getIsLeafNode(jnode: ClientJNode, jnodes: ClientJNode[]): boolean {
  return jnodes.every((j) => !j.dependencies.includes(jnode.id));
}

type JnodesToFlowParams = {
  jnodes: ClientJNode[];
  destinationIds: string[];
  nodesIdsOnPath: string[];
  optionalIdsOnPath: string[];
  maintainSettings: Map<string, Partial<Node>>;
};

export function jnodesToFlow(params: JnodesToFlowParams): { nodes: Node<JNodeTypeData>[]; edges: Edge[] } {
  const { jnodes, destinationIds, nodesIdsOnPath, optionalIdsOnPath, maintainSettings } = params;

  const noNodesOnPath = nodesIdsOnPath.length === 0;

  const nodes = jnodes.map<Node<JNodeTypeData>>((jnode) => {
    const isOnPath = nodesIdsOnPath.includes(jnode.id);
    const isOnOptionalPath = optionalIdsOnPath.includes(jnode.id);
    const isLeafNode = getIsLeafNode(jnode, jnodes);
    const isDesNode = destinationIds.includes(jnode.id);

    return {
      id: jnode.id,
      position: { x: 0, y: 0 },
      data: { jnode, isOnPath, isLeafNode, noNodesOnPath, isOnOptionalPath, isDesNode },
      type: 'jnode',
      width: jnodeProps.dimensions.width,
      height: jnodeProps.dimensions.height,
      ...maintainSettings?.get(jnode.id),
    };
  });

  const edges = jnodes.reduce<Edge[]>(
    (list, jnode) => [
      ...list,
      ...jnode.dependencies.map<Edge>((depId) => {
        const nodeIsOnPath = nodesIdsOnPath.includes(jnode.id);
        const isOptional = optionalIdsOnPath.includes(jnode.id);
        const fadeOpacity = !isOptional && !nodeIsOnPath && !noNodesOnPath;

        const edge: Edge = {
          id: `${jnode.id}-${depId}`,
          source: depId,
          target: jnode.id,
          type: 'default',
        };

        if (isOptional) {
          edge.style = { stroke: '#228be6', strokeDasharray: '2.5,2.5' };
        }

        if (nodeIsOnPath) {
          edge.style = { stroke: '#228be6' };
        }

        if (fadeOpacity) {
          edge.style = { opacity: 0.2 };
        }

        return edge;
      }),
    ],
    [],
  );

  return { nodes, edges };
}

export function highlightManyEdges(edges: Edge[], paths: JNode[][][]): Edge[] {
  return paths.flat().reduce<Edge[]>((list, jnodes) => highlightEdges(list, jnodes), edges);
}

export function isJnodeNodeType(node: Node): node is Node<JNodeTypeData> {
  return node.type === 'jnode';
}

export function getBoundsOfNodes(nodes: Node[]): Rect {
  return nodes.reduce<Rect>(
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
    { x: Infinity, y: Infinity, width: 0, height: 0 },
  );
}
