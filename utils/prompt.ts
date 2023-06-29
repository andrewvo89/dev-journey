import { ClientPrompt, Prompt } from 'types/common';
import { JNodeType, JnodesMap } from 'types/jnode';

import { jnodeSchema } from 'schemas/jnode';

export function getTechPrompts(jnodeMap: JnodesMap): Prompt[] {
  return Object.values(jnodeMap)
    .filter((t) => {
      const allowedTypes: JNodeType[] = ['database', 'framework', 'language', 'library', 'platform', 'runtime', 'tool'];
      return allowedTypes.includes(t.type);
    })
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
    response: async () => {
      const jsJnode = jnodeSchema.parse(jnodeMap['language/javascript']);
      return {
        destinations: Object.values(jnodeMap)
          .filter((t) => t.dependencies.includes(jsJnode.id) && ['framework', 'library'].includes(t.type))
          .map((language) => ({ id: language.id })),
      };
    },
  };
}

export function getPythonPrompt(jnodeMap: JnodesMap): Prompt {
  return {
    id: 'python_framework',
    prompt: 'I want to learn a Python library/framework',
    priority: 2,
    response: async () => {
      const pythonJnode = jnodeSchema.parse(jnodeMap['language/python']);
      return {
        destinations: Object.values(jnodeMap)
          .filter((t) => t.dependencies.includes(pythonJnode.id) && ['framework', 'library'].includes(t.type))
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
    response: async () => {
      const relationalJnode = jnodeSchema.parse(jnodeMap['paradigm/relational']);
      return {
        destinations: Object.values(jnodeMap)
          .filter((t) => t.dependencies.includes(relationalJnode.id))
          .map((language) => ({ id: language.id })),
      };
    },
  };
}

export function getNosqlPrompt(jnodeMap: JnodesMap): Prompt {
  return {
    id: 'nosql_database',
    prompt: 'I want to learn a NoSQL database',
    priority: 2,
    response: async () => {
      const nosqlJnode = jnodeSchema.parse(jnodeMap['paradigm/nosql']);
      return {
        destinations: Object.values(jnodeMap)
          .filter((t) => t.dependencies.includes(nosqlJnode.id))
          .map((language) => ({ id: language.id })),
      };
    },
  };
}

export function getClientPrompts(prompts: Prompt[]): ClientPrompt[] {
  return prompts.map<ClientPrompt>((p) => ({ value: p.id, label: p.prompt }));
}
