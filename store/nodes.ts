import { ClientJNode, DestinationPath } from 'types/common';
import { Edge, Node } from 'reactflow';

import { JNodeTypeData } from 'types/flow';
import { create } from 'zustand';
import { jnodesToFlow } from 'utils/flow';

type NodeState = {
  jnodes: Map<string, ClientJNode>;
  nodes: Node<JNodeTypeData>[];
  edges: Edge[];
  initFlow: (jnodes: ClientJNode[], nodes: Node<JNodeTypeData>[], edges: Edge[]) => void;
  // onNodesChange: OnNodesChange;
  // onEdgesChange: OnEdgesChange;
  updateNodes: (desPaths: DestinationPath[], optPaths: DestinationPath[]) => void;
};

export const useNodeStore = create<NodeState>()((set) => ({
  jnodes: new Map(),
  nodes: [],
  edges: [],
  initFlow: (jnodes, nodes, edges) =>
    set({
      jnodes: jnodes.reduce<Map<string, ClientJNode>>((map, jnode) => map.set(jnode.id, jnode), new Map()),
      nodes,
      edges,
    }),
  updateNodes: (desPaths, optPaths) =>
    set((state) => {
      const nodeSettingsMap = state.nodes.reduce<Map<string, Partial<Node>>>(
        (map, node) =>
          map.set(node.id, {
            position: node.position,
            sourcePosition: node.sourcePosition,
            targetPosition: node.targetPosition,
          }),
        new Map(),
      );

      const nodeIdsOnPath = new Set<string>();
      const [enabled, disabled] = desPaths.reduce<[DestinationPath[], string[]]>(
        ([enabled, disabled], path) =>
          path.enabled ? [[...enabled, path], disabled] : [enabled, [...disabled, path.desId]],
        [[], []],
      );

      for (const path of enabled) {
        for (const routes of path.routes) {
          for (const jnode of routes) {
            nodeIdsOnPath.add(jnode.id);
          }
        }
      }

      const optionalIdsOnPath = new Set<string>();
      for (const path of optPaths) {
        if (disabled.includes(path.routes[0][0].id)) {
          continue;
        }
        for (const routes of path.routes) {
          for (const jnode of routes) {
            optionalIdsOnPath.add(jnode.id);
          }
        }
      }

      return jnodesToFlow(Array.from(state.jnodes.values()), nodeIdsOnPath, optionalIdsOnPath, nodeSettingsMap);
    }),
}));
