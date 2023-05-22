import { Edge } from 'reactflow';
import { NodeWithData } from 'types/flow';
import { getLayoutedElements } from 'utils/flow';
import { jNodes } from 'data/jnodes';

const nodes = jNodes.map<NodeWithData>((jNode) => ({
  id: jNode.id,
  data: { label: jNode.name, jNode },
  position: { x: 0, y: 0 },
}));

const edges = nodes.reduce<Edge[]>(
  (list, node) => [
    ...list,
    ...node.data.jNode.dependencies.map<Edge>((dependency) => ({
      id: `${node.id}-${dependency.id}`,
      source: dependency.id,
      target: node.id,
      type: 'default',
    })),
  ],
  [],
);

export const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, 'LR');
