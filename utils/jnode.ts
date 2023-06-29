import { JNodeShallow, JNodeType } from 'types/jnode';

import { DefaultMantineColor } from '@mantine/core';
import { jnodeTypeSchema } from 'schemas/jnode';

export function getRoutesToJnode(
  sourceJnodeId: string,
  targetJnode: JNodeShallow,
  jnodesMap: Map<string, JNodeShallow>,
): JNodeShallow[][] {
  const parentRoutes = targetJnode.dependencies.reduce<JNodeShallow[][]>((list, depId) => {
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

export function resolveNodeIdsToJNodes(nodeIds: string[], jnodesMap: Map<string, JNodeShallow>): JNodeShallow[] {
  return nodeIds.reduce<JNodeShallow[]>((list, id) => {
    const found = jnodesMap.get(id);
    if (found) {
      list.push(found);
    }
    return list;
  }, []);
}

export const jnodeTypeMap: Record<JNodeType, { label: string; color: DefaultMantineColor }> = {
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
