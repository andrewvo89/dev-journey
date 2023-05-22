import { getLayoutedElements, jNodesToFlow } from 'utils/flow';
import { root, techMap } from 'data/tech';

export const initialJNodes = [root, ...Object.values(techMap)];

const { nodes, edges } = jNodesToFlow(initialJNodes, [], new Map());
export const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, 'LR');
