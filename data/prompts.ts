import { CareerPrompt, ClientPrompt, Prompt } from 'types/common';
import { deno, golang, java, react as reactJNode, rust, svelte, vue } from 'data/jnodes';
import { initialEdges, initialNodes } from 'data/flow';

import { Edge } from 'reactflow';
import { getPathsToNode } from 'utils/jnodes';
import { highlightEdges } from 'utils/flow';

const frontend: CareerPrompt = {
  id: 'frontend',
  prompt: 'I want to become a frontend developer',
  type: 'career',
  response: () => {
    const paths = [getPathsToNode(reactJNode), getPathsToNode(vue), getPathsToNode(svelte)];
    const edges = paths.flat().reduce<Edge[]>((list, path) => highlightEdges(list, path), initialEdges);
    return { nodes: initialNodes, edges };
  },
};

const backend: CareerPrompt = {
  id: 'backend',
  prompt: 'I want to become a backend developer',
  type: 'career',
  response: () => {
    const paths = [getPathsToNode(deno), getPathsToNode(java), getPathsToNode(rust), getPathsToNode(golang)];
    const edges = paths.flat().reduce<Edge[]>((list, path) => highlightEdges(list, path), initialEdges);
    return { nodes: initialNodes, edges };
  },
};

// const react: CareerPrompt = {
//   id: 'react',
//   prompt: 'I want to learn react',
//   type: 'technology',
//   jNodes: [
//     {
//       id: 'frontend',
//       name: 'Junior Frontend Developer',
//       type: 'career',
//     },
//   ],
// };

export const prompts: Prompt[] = [frontend, backend];

export const clientPrompts = prompts.map<ClientPrompt>((p) => ({
  value: p.id,
  label: p.prompt,
}));
