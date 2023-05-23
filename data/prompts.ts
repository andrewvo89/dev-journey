import { ClientPrompt, Prompt } from 'types/common';

import { careersMap } from 'data/careers';
import { techMap } from 'data/tech';

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
    goalIds: jNode.dependencies,
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
