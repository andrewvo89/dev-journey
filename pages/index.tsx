import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getClientPrompts, getPrompts } from 'utils/prompt';

import { ClientPrompt } from 'types/journey';
import Home from 'components/Home';
import { JnodeShallow } from 'types/jnode';
import { getJnodesMap } from '../utils/github';
import placeholdersJSON from 'data/placeholders.json';
import { placeholdersJSONSchema } from 'schemas/data';

export type Props = {
  placeholder: string;
  prompts: ClientPrompt[];
  initialJNodes: JnodeShallow[];
};

const placeholders = placeholdersJSONSchema.parse(placeholdersJSON);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
  const jnodesMap = await getJnodesMap();
  const prompts = getClientPrompts(getPrompts(jnodesMap));
  const initialJNodes = Object.values(jnodesMap).map<JnodeShallow>((jnode) => ({
    ...jnode,
    resources: Object.values(jnode.resources).flat().length,
  }));
  return { props: { placeholder, prompts, initialJNodes } };
};

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
