import { ClientPrompt, JNode } from 'types/common';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getLayoutedElements, jNodesToFlow } from 'utils/flow';

import { Edge } from 'reactflow';
import Home from 'components/Home';
import { NodeWithData } from 'types/flow';
import { clientPrompts } from 'data/prompts';
import rootJSON from 'data/root.json';
import techJSON from 'data/tech.json';
import { techJSONSchema } from 'schemas/data';

const tech = techJSONSchema.parse(techJSON);
const root = techJSONSchema.parse(rootJSON);

const initialJNodes = [...Object.values(root), ...Object.values(tech).sort((a, b) => a.name.localeCompare(b.name))];
const { nodes, edges } = jNodesToFlow(initialJNodes, new Set(), new Map());
const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, 'LR');

export type Props = {
  prompts: ClientPrompt[];
  initialNodes: NodeWithData[];
  initialEdges: Edge[];
  initialJNodes: JNode[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { props: { prompts: clientPrompts, initialNodes, initialEdges, initialJNodes } };
};

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
