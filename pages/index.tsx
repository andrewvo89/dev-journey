import { ClientJNode, ClientPrompt } from 'types/common';
import { Edge, Node } from 'reactflow';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getLayoutedElements, jnodesToFlow } from 'utils/flow';
import { jnodeJSONSchema, placeholdersJSONSchema } from 'schemas/data';

import Home from 'components/Home';
import { JNodeTypeData } from 'types/flow';
import { clientPrompts } from 'data/prompts';
import databasesJSON from 'data/databases.json';
import fieldsJSON from 'data/fields.json';
import frameworksJSON from 'data/frameworks.json';
import languagesJSON from 'data/languages.json';
import librariesJSON from 'data/libraries.json';
import paradigmsJSON from 'data/paradigms.json';
import placeholdersJSON from 'data/placeholders.json';
import platformsJSON from 'data/platforms.json';
import rootJSON from 'data/root.json';
import softwareJSON from 'data/software.json';
import toolsJSON from 'data/tools.json';

export type Props = {
  placeholder: string;
  prompts: ClientPrompt[];
  initialNodes: Node<JNodeTypeData>[];
  initialEdges: Edge[];
  initialJNodes: ClientJNode[];
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
  ...softwareJSON,
  ...toolsJSON,
});

const placeholders = placeholdersJSONSchema.parse(placeholdersJSON);
const initialJNodes = Object.values(jnodeJSONs)
  .sort((a, b) => a.attributes.group.localeCompare(b.attributes.group) || a.name.localeCompare(b.name))
  .map<ClientJNode>((jnode) => ({
    dependencies: jnode.dependencies,
    description: jnode.description,
    id: jnode.id,
    name: jnode.name,
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
