import { Node } from 'reactflow';

export type NodeData = { label: string; isOnPath: boolean };

export type NodeWithData = Node<NodeData>;
