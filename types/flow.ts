import { JNode } from 'types/common';
import { Node } from 'reactflow';

export type NodeData = { label: string; jNode: JNode };

export type NodeWithData = Node<NodeData>;
