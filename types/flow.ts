import { JNode } from 'types/common';

export type NodeTypeProps = {
  type: 'jnode';
  dimensions: {
    width: 200;
    height: 50;
  };
};

export const jnodeProps: NodeTypeProps = {
  type: 'jnode',
  dimensions: {
    width: 200,
    height: 50,
  },
};

export type JNodeTypeData = {
  jnode: JNode;
  isOnPath: boolean;
  isLeafNode: boolean;
  noNodesOnPath: boolean;
  isOnOptionalPath: boolean;
};
