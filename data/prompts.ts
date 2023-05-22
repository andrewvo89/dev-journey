import { ClientPrompt, Prompt } from 'types/common';

import { careersMap } from 'data/careers';
import { techMap } from 'data/tech';

// const typesafe: Prompt = {
//   id: 'typesafe',
//   prompt: 'I like type safe languages',
//   response: async () => ({
//     nodes: initialNodes,
//     edges: highlightManyEdges(
//       initialEdges,
//       [techMap.typescript, techMap.java, techMap.rust, techMap.golang].map(getPathsToNode),
//     ),
//   }),
// };

const techPrompts = Object.values(techMap).map<Prompt>((jNode) => ({
  id: jNode.id,
  prompt: `I want to learn ${jNode.name}`,
  response: async () => ({
    goalIds: [jNode.id],
  }),
}));

const careerPrompts = Object.values(careersMap).map<Prompt>((jNode) => ({
  id: jNode.id,
  prompt: `I want to become a ${jNode.name}`,
  response: async () => ({
    goalIds: jNode.dependencies.map((dep) => dep.id),
  }),
}));

export const prompts: Prompt[] = [...techPrompts, ...careerPrompts];

export const promptsMap = prompts.reduce<Record<string, Prompt>>(
  (obj, prompt) => ({ ...obj, [prompt.id]: prompt }),
  {},
);

export const clientPrompts = prompts.map<ClientPrompt>((p) => ({
  value: p.id,
  label: p.prompt,
}));
