import { ClientPrompt, Prompt } from 'types/common';

import { JNodeType } from 'types/jnode';
import databasesJSON from 'data/databases.json';
import fieldsJSON from 'data/fields.json';
import frameworksJSON from 'data/frameworks.json';
import { jnodeJSONSchema } from 'schemas/data';
import { jnodeSchema } from 'schemas/jnode';
import languagesJSON from 'data/languages.json';
import librariesJSON from 'data/libraries.json';
import paradigmsJSON from 'data/paradigms.json';
import platformsJSON from 'data/platforms.json';
import rootJSON from 'data/root.json';
import runtimeJSON from 'data/runtime.json';
import toolsJSON from 'data/tools.json';

const jnodeJSONs = jnodeJSONSchema.parse({
  ...databasesJSON,
  ...fieldsJSON,
  ...frameworksJSON,
  ...languagesJSON,
  ...librariesJSON,
  ...paradigmsJSON,
  ...platformsJSON,
  ...rootJSON,
  ...runtimeJSON,
  ...toolsJSON,
});

const techList = Object.values(jnodeJSONs);
const techPrompts = techList
  .filter((t) => {
    const allowedTypes: JNodeType[] = [
      'database',
      'framework',
      'language',
      'library',
      'meta_framework',
      'platform',
      'runtime',
      'tool',
    ];
    return allowedTypes.includes(t.type);
  })
  .sort((a, b) => a.name.localeCompare(b.name))
  .map<Prompt>((jnode) => ({
    id: jnode.id,
    priority: 4,
    prompt: `I want to learn ${jnode.name}`,
    response: async () => ({
      destinations: [{ id: jnode.id }],
    }),
  }));

const javascriptFramwork: Prompt = {
  id: 'javascript_framework',
  prompt: 'I want to learn a JavaScript library/framework',
  priority: 2,
  response: async () => {
    const jsJnode = jnodeSchema.parse(languagesJSON.javascript);
    return {
      destinations: techList
        .filter((t) => t.dependencies.includes(jsJnode.id) && ['framework', 'library'].includes(t.type))
        .map((language) => ({ id: language.id })),
    };
  },
};

const pythonFramwork: Prompt = {
  id: 'python_framework',
  prompt: 'I want to learn a Python library/framework',
  priority: 2,
  response: async () => {
    const pythonJnode = jnodeSchema.parse(languagesJSON.python);
    return {
      destinations: techList
        .filter((t) => t.dependencies.includes(pythonJnode.id) && ['framework', 'library'].includes(t.type))
        .map((language) => ({ id: language.id })),
    };
  },
};

const relationalDatabases: Prompt = {
  id: 'relational_database',
  prompt: 'I want to learn a relational database',
  priority: 2,
  response: async () => {
    const relationalJnode = jnodeSchema.parse(paradigmsJSON.relational);
    return {
      destinations: techList
        .filter((t) => t.dependencies.includes(relationalJnode.id))
        .map((language) => ({ id: language.id })),
    };
  },
};

const nosqlDatabases: Prompt = {
  id: 'nosql_database',
  prompt: 'I want to learn a NoSQL database',
  priority: 2,
  response: async () => {
    const nosqlJnode = jnodeSchema.parse(paradigmsJSON.nosql);
    return {
      destinations: techList
        .filter((t) => t.dependencies.includes(nosqlJnode.id))
        .map((language) => ({ id: language.id })),
    };
  },
};

export const prompts: Prompt[] = [
  ...techPrompts,
  relationalDatabases,
  nosqlDatabases,
  pythonFramwork,
  javascriptFramwork,
].sort((a, b) => a.priority - b.priority);

export const promptsMap = prompts.reduce<Record<string, Prompt>>(
  (obj, prompt) => ({ ...obj, [prompt.id]: prompt }),
  {},
);

export const clientPrompts = prompts.map<ClientPrompt>((p) => ({
  value: p.id,
  label: p.prompt,
}));
