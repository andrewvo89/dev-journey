export type JNodeTypeProps = {
  type: 'jnode';
  dimensions: {
    width: 200;
    height: 50;
  };
};

export const jnodeProps: JNodeTypeProps = {
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
