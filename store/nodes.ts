import { Edge, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import { JNode } from 'types/common';
import { NodeWithData } from 'types/flow';
import { create } from 'zustand';
import { getPathsToNode } from 'utils/jnodes';
import { jNodesToFlow } from 'utils/flow';

type NodeState = {
  jNodes: Map<string, JNode>;
  nodes: NodeWithData[];
  edges: Edge[];
  initFlow: (jNodes: JNode[], nodes: NodeWithData[], edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodesWithGoals: (goalIds: string[]) => void;
};

export const useNodeStore = create<NodeState>()((set) => ({
  jNodes: new Map(),
  nodes: [],
  edges: [],
  initFlow: (jNodes, nodes, edges) =>
    set({
      jNodes: jNodes.reduce<Map<string, JNode>>((map, jNode) => map.set(jNode.id, jNode), new Map()),
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
      const nodeSettingsMap = state.nodes.reduce<Map<string, Partial<NodeWithData>>>(
        (map, node) =>
          map.set(node.id, {
            position: node.position,
            sourcePosition: node.sourcePosition,
            targetPosition: node.targetPosition,
          }),
        new Map(),
      );

      const goalJNodes = goalIds.reduce<JNode[]>((list, id) => {
        const found = state.jNodes.get(id);
        if (found) {
          list.push(found);
        }
        return list;
      }, []);

      const journeys = goalJNodes.map((goalJNode) => getPathsToNode(goalJNode, state.jNodes));
      const nodesOnPath = new Set<JNode>();
      for (const journey of journeys) {
        for (const paths of journey) {
          for (const jNode of paths) {
            nodesOnPath.add(jNode);
          }
        }
      }

      const { edges, nodes } = jNodesToFlow(Array.from(state.jNodes.values()), nodesOnPath, nodeSettingsMap);
      return { nodes, edges };
    }),
}));
