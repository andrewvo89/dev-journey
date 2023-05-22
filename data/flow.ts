import { root, techMap } from 'data/tech';

import { jNodesToFlow } from 'utils/flow';

export const { nodes: initialNodes, edges: initialEdges } = jNodesToFlow([root, ...Object.values(techMap)]);
