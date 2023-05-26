import { ClientJNode, Path } from 'types/common';

export function getPathsToJnode(
  sourceJnodeId: string,
  targetJnode: ClientJNode,
  jnodesMap: Map<string, ClientJNode>,
): ClientJNode[][] {
  const parentPaths = targetJnode.dependencies.reduce<ClientJNode[][]>((list, depId) => {
    const dependency = jnodesMap.get(depId);
    if (!dependency) {
      return list;
    }
    if (dependency.id === sourceJnodeId) {
      return [...list, [dependency]];
    }
    const paths = getPathsToJnode(sourceJnodeId, dependency, jnodesMap);
    if (paths.length === 0) {
      return [...list, [dependency]];
    }
    return [...list, ...paths];
  }, []);
  return parentPaths.map((path) => [...path, targetJnode]);
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

export function getJnodePath(sourceJnode: string, targetJnode: ClientJNode, jnodesMap: Map<string, ClientJNode>): Path {
  return {
    desId: targetJnode.id,
    enabled: true,
    routes: getPathsToJnode(sourceJnode, targetJnode, jnodesMap),
  };
}
