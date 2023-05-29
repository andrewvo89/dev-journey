import { JNodeType } from 'types/common';
import LegentListItem from 'components/LegendListItem';
import { Stack } from '@mantine/core';
import { useMemo } from 'react';
import { useNodeStore } from 'store/nodes';

export function LegendList() {
  const nodes = useNodeStore((state) => state.nodes);
  const uniqueTypes = useMemo<Set<JNodeType>>(
    () => nodes.reduce((list, node) => list.add(node.data.jnode.type), new Set<JNodeType>()),
    [nodes],
  );

  return (
    <Stack>
      {Array.from(uniqueTypes).map((type) => (
        <LegentListItem key={type} type={type} />
      ))}
    </Stack>
  );
}
