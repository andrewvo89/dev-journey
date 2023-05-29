import { ClientPrompt, Prompt } from 'types/common';
import { careerJSONSchema, techJSONSchema } from 'schemas/data';

import careersJSON from 'data/careers.json';
import { jnodeSchema } from 'schemas/common';
import techJSON from 'data/tech.json';

const tech = techJSONSchema.parse(techJSON);
const techList = Object.values(tech);
const techPrompts = techList
  .sort((a, b) => a.name.localeCompare(b.name))
  .map<Prompt>((jnode) => ({
    id: jnode.id,
    priority: 4,
    prompt: `I want to learn ${jnode.name}`,
    response: async () => ({
      destinations: [{ id: jnode.id }],
    }),
  }));

const careers = careerJSONSchema.parse(careersJSON);
const careerPrompts = Object.values(careers)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map<Prompt>((career) => ({
    id: career.id,
    priority: 3,
    prompt: `I want to be a ${career.name}`,
    response: async () => {
      const goalJnodes = techList.filter((t) => t.attributes.careers.includes(career.id));
      return {
        destinations: goalJnodes.map((jnode) => ({ id: jnode.id })),
      };
    },
  }));

const languagePrompt: Prompt = {
  id: 'programming_language',
  prompt: 'I want to learn a programming language',
  priority: 1,
  response: async () => ({
    destinations: techList.filter((t) => t.type === 'language').map((language) => ({ id: language.id })),
  }),
};

const javascriptFramwork: Prompt = {
  id: 'javascript_framework',
  prompt: 'I want to learn a JavaScript library/framework',
  priority: 2,
  response: async () => {
    const jsJnode = jnodeSchema.parse(techJSON.javascript);
    return {
      destinations: techList
        .filter((t) => t.dependencies.includes(jsJnode.id))
        .map((language) => ({ id: language.id })),
    };
  },
};

export const prompts: Prompt[] = [...techPrompts, ...careerPrompts, languagePrompt, javascriptFramwork].sort(
  (a, b) => a.priority - b.priority,
);

export const promptsMap = prompts.reduce<Record<string, Prompt>>(
  (obj, prompt) => ({ ...obj, [prompt.id]: prompt }),
  {},
);

export const clientPrompts = prompts.map<ClientPrompt>((p) => ({
  value: p.id,
  label: p.prompt,
}));
