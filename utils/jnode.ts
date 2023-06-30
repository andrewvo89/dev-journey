import { JnodeShallow, JnodeType } from 'types/jnode';

import { DefaultMantineColor } from '@mantine/core';
import { jnodeTypeSchema } from 'schemas/jnode';

export function getRoutesToJnode(
  sourceJnodeId: string,
  targetJnode: JnodeShallow,
  jnodesMap: Map<string, JnodeShallow>,
): JnodeShallow[][] {
  const parentRoutes = targetJnode.dependencies.reduce<JnodeShallow[][]>((list, depId) => {
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

export function resolveNodeIdsToJNodes(nodeIds: string[], jnodesMap: Map<string, JnodeShallow>): JnodeShallow[] {
  return nodeIds.reduce<JnodeShallow[]>((list, id) => {
    const found = jnodesMap.get(id);
    if (found) {
      list.push(found);
    }
    return list;
  }, []);
}

export const jnodeTypeMap: Record<JnodeType, { label: string; color: DefaultMantineColor }> = {
  root: { label: 'Start of journey', color: 'blue' },
  language: { label: 'Language', color: 'red' },
  database: { label: 'Database', color: 'cyan' },
  tool: { label: 'Tool', color: 'teal' },
  library: { label: 'Library', color: 'violet' },
  framework: { label: 'Framework', color: 'pink' },
  // meta_framework: { label: 'Meta Framework', color: 'grape' },
  runtime: { label: 'Runtime', color: 'orange' },
  paradigm: { label: 'Paradigm', color: 'lime' },
  platform: { label: 'Platform', color: 'green' },
  field: { label: 'Field', color: 'indigo' },
  // career: { label: 'Career', color: 'yellow' },
};
export const jnodeTypes = Object.keys(jnodeTypeMap).map((key) => jnodeTypeSchema.parse(key));
