import { JNode } from 'types/jnode';

export type NodeTypeProps = {
  type: 'fallback';
  dimensions: {
    width: 200;
    height: 50;
  };
};

export const jnodeProps: NodeTypeProps = {
  type: 'fallback',
  dimensions: {
    width: 200,
    height: 50,
  },
};

export type JNodeTypeData = {
  jnode: JNode;
  isDesNode: boolean;
  isOnPath: boolean;
  isLeafNode: boolean;
  noNodesOnPath: boolean;
  isOnOptionalPath: boolean;
};
