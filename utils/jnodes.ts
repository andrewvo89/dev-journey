import { JNode } from 'types/common';

export function getPathsToNode(jNode: JNode, jNodesMap: Map<string, JNode>): JNode[][] {
  const parentPaths = jNode.dependencies.reduce<JNode[][]>((list, depId) => {
    const dependency = jNodesMap.get(depId);
    if (!dependency) {
      return list;
    }
    const paths = getPathsToNode(dependency, jNodesMap);
    if (paths.length === 0) {
      return [...list, [dependency]];
    }
    return [...list, ...paths];
  }, []);
  return parentPaths.map((path) => [...path, jNode]);
}
