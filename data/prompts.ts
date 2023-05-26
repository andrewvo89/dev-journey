import { ClientPrompt, Prompt } from 'types/common';
import { careerJSONSchema, techJSONSchema } from 'schemas/data';

import careersJSON from 'data/careers.json';
import techJSON from 'data/tech.json';

const tech = techJSONSchema.parse(techJSON);
const techList = Object.values(tech);
const techPrompts = techList.map<Prompt>((jnode) => ({
  id: jnode.id,
  prompt: `I want to learn ${jnode.name}`,
  response: async () => ({
    destinations: [{ id: jnode.id, pathways: jnode.pathways }],
  }),
}));

const careers = careerJSONSchema.parse(careersJSON);
const careerPrompts = Object.values(careers).map<Prompt>((career) => ({
  id: career.id,
  prompt: `I want to be a ${career.name.toLowerCase()}`,
  response: async () => {
    const goalJnodes = techList.filter((t) => t.attributes.careers.includes(career.id));
    return {
      destinations: goalJnodes.map((jnode) => ({ id: jnode.id, pathways: jnode.pathways })),
    };
  },
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
