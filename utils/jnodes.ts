import { JNode } from 'types/common';

export function getPathsToNode(node: JNode): JNode[][] {
  const parentPaths = node.dependencies.reduce<JNode[][]>((list, dependency) => {
    const paths = getPathsToNode(dependency);
    if (paths.length === 0) {
      return [...list, [dependency]];
    }
    return [...list, ...paths];
  }, []);
  return parentPaths.map((path) => [...path, node]);
}
