import { Edge, Node } from 'reactflow';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { initialEdges, initialNodes } from 'data/flow';

import { ClientPrompt } from '../types/common';
import Home from 'components/home';
import { clientPrompts } from 'data/prompts';

export type Props = {
  prompts: ClientPrompt[];
  initialNodes: Node[];
  initialEdges: Edge[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { props: { prompts: clientPrompts, initialNodes, initialEdges } };
};

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
