import { Destination, DestinationWithRoutes } from 'types/common';
import { Edge, Node } from 'reactflow';
import { getRoutesToJnode, resolveNodeIdsToJNodes } from 'utils/jnode';

import { JNodeTypeData } from 'types/flow';
import { JnodeShallow } from 'types/jnode';
import { create } from 'zustand';
import { jnodesToFlow } from 'utils/flow';

type NodeState = {
  jnodes: Map<string, JnodeShallow>;
  nodes: Node<JNodeTypeData>[];
  edges: Edge[];
  initFlow: (jnodes: JnodeShallow[], nodes: Node<JNodeTypeData>[], edges: Edge[]) => void;
  updateNodes: (destinations: Destination[]) => void;
};

export const useNodeStore = create<NodeState>()((set) => ({
  jnodes: new Map(),
  nodes: [],
  edges: [],
  initFlow: (jnodes, nodes, edges) =>
    set({
      jnodes: jnodes.reduce<Map<string, JnodeShallow>>((map, jnode) => map.set(jnode.id, jnode), new Map()),
      nodes,
      edges,
    }),
  updateNodes: (destinations) =>
    set((state) => {
      // Convert map to array
      const jnodesList = Array.from(state.jnodes.values());

      // Create a map of node settings to maintain the position of nodes
      const nodeSettingsMap = state.nodes.reduce<Map<string, Partial<Node>>>(
        (map, node) =>
          map.set(node.id, {
            position: node.position,
            sourcePosition: node.sourcePosition,
            targetPosition: node.targetPosition,
          }),
        new Map(),
      );

      const enabledDesIds = destinations.filter((des) => des.enabled).map((des) => des.id);

      // Determine routes for all destination nodes
      const destinationWithRoutes = resolveNodeIdsToJNodes(enabledDesIds, state.jnodes).map<DestinationWithRoutes>(
        (jnode) => ({
          id: jnode.id,
          enabled: true,
          routes: getRoutesToJnode('root', jnode, state.jnodes),
        }),
      );

      // Get unique node ids on path
      const nodeIdsOnPath = destinationWithRoutes.reduce<Set<string>>((set, path) => {
        const newSet = new Set(set);
        path.routes.flatMap((route) => route.map((jnode) => jnode.id)).forEach((id) => newSet.add(id));
        return newSet;
      }, new Set());

      // Get unique optional node ids on path
      const optionalIdsOnPath = jnodesList.reduce<string[]>((list, jnode) => {
        if (jnode.dependencies.some((dep) => enabledDesIds.includes(dep))) {
          return [...list, jnode.id];
        }
        return list;
      }, []);

      return jnodesToFlow({
        jnodes: jnodesList,
        destinationIds: enabledDesIds,
        nodesIdsOnPath: Array.from(nodeIdsOnPath),
        optionalIdsOnPath,
        maintainSettings: nodeSettingsMap,
      });
    }),
}));
