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
  label: string;
  isOnPath: boolean;
  isLeafNode: boolean;
  noNodesOnPath: boolean;
};
