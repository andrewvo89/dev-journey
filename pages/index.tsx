import { ClientPrompt, JNode } from 'types/common';
import { Edge, Node } from 'reactflow';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getLayoutedElements, jnodesToFlow } from 'utils/flow';
import { placeholdersJSONSchema, techJSONSchema } from 'schemas/data';

import Home from 'components/Home';
import { JNodeTypeData } from 'types/flow';
import { clientPrompts } from 'data/prompts';
import placeholdersJSON from 'data/placeholders.json';
import rootJSON from 'data/root.json';
import techJSON from 'data/tech.json';

const tech = techJSONSchema.parse(techJSON);
const root = techJSONSchema.parse(rootJSON);
const placeholders = placeholdersJSONSchema.parse(placeholdersJSON);

const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
const initialJNodes = [...Object.values(root), ...Object.values(tech).sort((a, b) => a.name.localeCompare(b.name))];
const { nodes, edges } = jnodesToFlow(initialJNodes, new Set(), new Map());
const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, 'LR');

export type Props = {
  placeholder: string;
  prompts: ClientPrompt[];
  initialNodes: Node<JNodeTypeData>[];
  initialEdges: Edge[];
  initialJNodes: JNode[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { props: { placeholder, prompts: clientPrompts, initialNodes, initialEdges, initialJNodes } };
};

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
