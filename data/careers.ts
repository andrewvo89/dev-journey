import { JNode } from 'types/common';
import { techMap } from 'data/tech';

// const frontend: Prompt = {
//   id: 'frontend',
//   prompt: 'I want to become a frontend developer',
//   response: async () => ({
//     nodes: initialNodes,
//     edges: highlightManyEdges(initialEdges, [reactJNode, vue, svelte].map(getPathsToNode)),
//   }),
// };

// const backend: Prompt = {
//   id: 'backend',
//   prompt: 'I want to become a backend developer',
//   response: async () => ({
//     nodes: initialNodes,
//     edges: highlightManyEdges(initialEdges, [deno, java, rust, golang].map(getPathsToNode)),
//   }),
// };

export const html: JNode = {
  id: 'frontend',
  name: 'Frontend developer',
  dependencies: [techMap.react, techMap.vue, techMap.svelte],
};

export const css: JNode = {
  id: 'backend',
  name: 'Backend developer',
  dependencies: [techMap.html],
};

export const devops: JNode = {
  id: 'devops',
  name: 'DevOps engineer',
  dependencies: [techMap.html, techMap.css],
};

export const database_administrator: JNode = {
  id: 'database_administrator',
  name: 'Database administrator',
  dependencies: [techMap.html, techMap.css],
};

export const careersMap = {
  html,
  css,
  devops,
  database_administrator,
};
