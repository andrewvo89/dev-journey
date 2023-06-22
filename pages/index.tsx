import { Edge, Node } from 'reactflow';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getLayoutedElements, jnodesToFlow } from 'utils/flow';
import { jnodeJSONSchema, placeholdersJSONSchema } from 'schemas/data';

import { ClientPrompt } from 'types/common';
import Home from 'components/Home';
import { JNode } from 'types/jnode';
import { JNodeTypeData } from 'types/flow';
import { clientPrompts } from 'data/prompts';
import databasesJSON from 'data/jnodes/databases.json';
import fieldsJSON from 'data/jnodes/fields.json';
import frameworksJSON from 'data/jnodes/frameworks.json';
import languagesJSON from 'data/jnodes/languages.json';
import librariesJSON from 'data/jnodes/libraries.json';
import paradigmsJSON from 'data/jnodes/paradigms.json';
import placeholdersJSON from 'data/placeholders.json';
import platformsJSON from 'data/jnodes/platforms.json';
import rootJSON from 'data/jnodes/root.json';
import runtimeJSON from 'data/jnodes/runtime.json';
import toolsJSON from 'data/jnodes/tools.json';

export type Props = {
  placeholder: string;
  prompts: ClientPrompt[];
  initialNodes: Node<JNodeTypeData>[];
  initialEdges: Edge[];
  initialJNodes: JNode[];
};

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

const placeholders = placeholdersJSONSchema.parse(placeholdersJSON);
const initialJNodes = Object.values(jnodeJSONs)
  // .sort((a, b) => a.attributes.group.localeCompare(b.attributes.group) || a.name.localeCompare(b.name))
  .map<JNode>((jnode) => ({
    dependencies: jnode.dependencies,
    description: jnode.description,
    id: jnode.id,
    title: jnode.title,
    resources: jnode.resources,
    type: jnode.type,
  }));

const { nodes, edges } = jnodesToFlow({
  jnodes: initialJNodes,
  destinationIds: [],
  maintainSettings: new Map(),
  nodesIdsOnPath: [],
  optionalIdsOnPath: [],
});
const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, 'LR');

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
  return { props: { placeholder, prompts: clientPrompts, initialNodes, initialEdges, initialJNodes } };
};

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
