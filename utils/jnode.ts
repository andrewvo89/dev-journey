import { ClientJNode } from 'types/common';

export function getRoutesToJnode(
  sourceJnodeId: string,
  targetJnode: ClientJNode,
  jnodesMap: Map<string, ClientJNode>,
): ClientJNode[][] {
  const parentRoutes = targetJnode.dependencies.reduce<ClientJNode[][]>((list, depId) => {
    const dependency = jnodesMap.get(depId);
    if (!dependency) {
      return list;
    }
    if (dependency.id === sourceJnodeId) {
      return [...list, [dependency]];
    }
    const routes = getRoutesToJnode(sourceJnodeId, dependency, jnodesMap);
    if (routes.length === 0) {
      return [...list, [dependency]];
    }
    return [...list, ...routes];
  }, []);
  return parentRoutes.map((path) => [...path, targetJnode]);
}

export function resolveNodeIdsToJNodes(nodeIds: string[], jnodesMap: Map<string, ClientJNode>): ClientJNode[] {
  return nodeIds.reduce<ClientJNode[]>((list, id) => {
    const found = jnodesMap.get(id);
    if (found) {
      list.push(found);
    }
    return list;
  }, []);
}
