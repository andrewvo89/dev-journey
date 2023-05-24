import { Edge, Node, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import { ClientJNode } from 'types/common';
import { JNodeTypeData } from 'types/flow';
import { create } from 'zustand';
import { getPathsToNode } from 'utils/jnodes';
import { jnodesToFlow } from 'utils/flow';

type NodeState = {
  jnodes: Map<string, ClientJNode>;
  nodes: Node<JNodeTypeData>[];
  edges: Edge[];
  initFlow: (jnodes: ClientJNode[], nodes: Node<JNodeTypeData>[], edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodesWithGoals: (goalIds: string[]) => void;
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
  updateNodesWithGoals: (goalIds) =>
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

      const goalJNodes = goalIds.reduce<ClientJNode[]>((list, id) => {
        const found = state.jnodes.get(id);
        if (found) {
          list.push(found);
        }
        return list;
      }, []);

      const journeys = goalJNodes.map((goalJNode) => getPathsToNode(goalJNode, state.jnodes));
      const nodesOnPath = new Set<ClientJNode>();
      for (const journey of journeys) {
        for (const paths of journey) {
          for (const jnode of paths) {
            nodesOnPath.add(jnode);
          }
        }
      }

      const { edges, nodes } = jnodesToFlow(Array.from(state.jnodes.values()), nodesOnPath, nodeSettingsMap);
      return { nodes, edges };
    }),
}));
