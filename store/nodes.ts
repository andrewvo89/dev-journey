import { ClientJNode, Path } from 'types/common';
import { Edge, Node, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import { JNodeTypeData } from 'types/flow';
import { create } from 'zustand';
import { jnodesToFlow } from 'utils/flow';

type NodeState = {
  jnodes: Map<string, ClientJNode>;
  nodes: Node<JNodeTypeData>[];
  edges: Edge[];
  initFlow: (jnodes: ClientJNode[], nodes: Node<JNodeTypeData>[], edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodes: (goalPaths: Path[], optionalPaths: Path[]) => void;
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
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),
  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),
  updateNodes: (desPaths, optPaths) =>
    set((state) => {
      const desIds = new Set(desPaths.map((path) => path.desId));

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
      for (const path of desPaths) {
        for (const routes of path.routes) {
          for (const jnode of routes) {
            nodeIdsOnPath.add(jnode.id);
          }
        }
      }

      const optionalIdsOnPath = new Set<string>();
      for (const path of optPaths) {
        for (const routes of path.routes) {
          for (const jnode of routes) {
            optionalIdsOnPath.add(jnode.id);
          }
        }
      }
      return jnodesToFlow(Array.from(state.jnodes.values()), nodeIdsOnPath, optionalIdsOnPath, desIds, nodeSettingsMap);
    }),
}));
