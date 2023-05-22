import { Edge, Node } from 'reactflow';

export type BaseJNode = {
  id: string;
  name: string;
};

export type TechnologyJNode = BaseJNode & {
  type: 'technology';
};

export type CareerJNode = BaseJNode & {
  type: 'career';
};

export type UnionJNode = TechnologyJNode | CareerJNode;

export type JNode = UnionJNode & {
  dependencies: JNode[];
};

export type BasePrompt = {
  id: string;
  prompt: string;
  response: () => {
    nodes: Node[];
    edges: Edge[];
  };
};

export type CareerPrompt = BasePrompt & {
  type: 'career';
};

export type TechnologyPrompt = BasePrompt & {
  type: 'technology';
};

export type UnionPrompt = CareerPrompt | TechnologyPrompt;

export type Prompt = UnionPrompt;

export type ClientPrompt = {
  value: string;
  label: string;
};
