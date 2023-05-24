import { JNode } from 'types/common';

export function getPathsToNode(jnode: JNode, jnodesMap: Map<string, JNode>): JNode[][] {
  const parentPaths = jnode.dependencies.reduce<JNode[][]>((list, depId) => {
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
