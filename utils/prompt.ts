import { ClientPrompt, Prompt, PromptResponse } from 'types/common';
import { JNodeType, JnodesMap } from 'types/jnode';

import axios from 'axios';
import { promptResponseSchema } from 'schemas/common';

export function getTechPrompts(jnodeMap: JnodesMap): Prompt[] {
  const allowedTypes: JNodeType[] = ['database', 'framework', 'language', 'library', 'platform', 'runtime', 'tool'];
  return Object.values(jnodeMap)
    .filter((t) => allowedTypes.includes(t.type))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map<Prompt>((jnode) => ({
      id: jnode.id.replace('/', '_'),
      priority: 4,
      prompt: `I want to learn ${jnode.title}`,
      response: async () => ({
        destinations: [{ id: jnode.id }],
      }),
    }));
}

export function getJavascriptPrompt(jnodeMap: JnodesMap): Prompt {
  return {
    id: 'javascript_framework',
    prompt: 'I want to learn a JavaScript library/framework',
    priority: 2,
    response: async () => ({
      destinations: Object.values(jnodeMap)
        .filter((t) => t.dependencies.some((dep) => ['language/javascript', 'language/typescript'].includes(dep)))
        .map((language) => ({ id: language.id })),
    }),
  };
}

export function getPythonPrompt(jnodeMap: JnodesMap): Prompt {
  return {
    id: 'python_framework',
    prompt: 'I want to learn a Python library/framework',
    priority: 2,
    response: async () => {
      return {
        destinations: Object.values(jnodeMap)
          .filter((t) => t.dependencies.includes('language/python'))
          .map((language) => ({ id: language.id })),
      };
    },
  };
}

export function getRelationalPrompt(jnodeMap: JnodesMap): Prompt {
  return {
    id: 'relational_database',
    prompt: 'I want to learn a relational database',
    priority: 2,
    response: async () => ({
      destinations: Object.values(jnodeMap)
        .filter((t) => t.dependencies.includes('paradigm/relational'))
        .map((language) => ({ id: language.id })),
    }),
  };
}

export function getNosqlPrompt(jnodeMap: JnodesMap): Prompt {
  return {
    id: 'nosql_database',
    prompt: 'I want to learn a NoSQL database',
    priority: 2,
    response: async () => ({
      destinations: Object.values(jnodeMap)
        .filter((t) => t.dependencies.includes('paradigm/nosql'))
        .map((language) => ({ id: language.id })),
    }),
  };
}

export function getClientPrompts(prompts: Prompt[]): ClientPrompt[] {
  return prompts.map<ClientPrompt>((p) => ({ value: p.id, label: p.prompt }));
}
/**
 * Given a jnodes map, return a list of prompts.
 * @export
 * @param {JnodesMap} jnodeMap
 * @return {*}  {Prompt[]}
 */
export function getPrompts(jnodeMap: JnodesMap): Prompt[] {
  return [
    ...getTechPrompts(jnodeMap),
    getJavascriptPrompt(jnodeMap),
    getPythonPrompt(jnodeMap),
    getRelationalPrompt(jnodeMap),
    getNosqlPrompt(jnodeMap),
  ].sort((a, b) => a.priority - b.priority);
}

/**
 * Given a prompt, return a list of destinations.
 * @export
 * @param {ClientPrompt} prompt
 * @return {*}  {Promise<PromptResponse['destinations']>}
 */
export async function getPromptDestinations(prompt: ClientPrompt): Promise<PromptResponse['destinations']> {
  const res = await axios.post<PromptResponse>(`/api/prompts/${prompt.value}`);
  return promptResponseSchema.parse(res.data).destinations;
}
