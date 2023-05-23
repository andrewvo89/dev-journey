import { ClientPrompt, JNode } from 'types/common';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { initialEdges, initialJNodes, initialNodes } from 'data/flow';

import { Edge } from 'reactflow';
import Home from 'components/Home';
import { NodeWithData } from 'types/flow';
import { clientPrompts } from 'data/prompts';

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
