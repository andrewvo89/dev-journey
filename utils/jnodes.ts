import { ClientJNode } from 'types/common';

export function getPathsToNode(jnode: ClientJNode, jnodesMap: Map<string, ClientJNode>): ClientJNode[][] {
  const parentPaths = jnode.dependencies.reduce<ClientJNode[][]>((list, depId) => {
    const dependency = jnodesMap.get(depId);
    if (!dependency) {
      return list;
    }
    const paths = getPathsToNode(dependency, jnodesMap);
    if (paths.length === 0) {
      return [...list, [dependency]];
    }
    return [...list, ...paths];
  }, []);
  return parentPaths.map((path) => [...path, jnode]);
}
