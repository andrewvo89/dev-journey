import { ClientPrompt, Prompt } from 'types/common';
import { JNodeType, JnodesMap } from 'types/jnode';

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
