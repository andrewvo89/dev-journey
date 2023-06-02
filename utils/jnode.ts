import { JNode } from 'types/jnode';

export function getRoutesToJnode(sourceJnodeId: string, targetJnode: JNode, jnodesMap: Map<string, JNode>): JNode[][] {
  const parentRoutes = targetJnode.dependencies.reduce<JNode[][]>((list, depId) => {
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

export function resolveNodeIdsToJNodes(nodeIds: string[], jnodesMap: Map<string, JNode>): JNode[] {
  return nodeIds.reduce<JNode[]>((list, id) => {
    const found = jnodesMap.get(id);
    if (found) {
      list.push(found);
    }
    return list;
  }, []);
}
