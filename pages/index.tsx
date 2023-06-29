import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import { ClientPrompt } from 'types/common';
import Home from 'components/Home';
import { JNodeShallow } from 'types/jnode';
import { getClientPrompts } from 'utils/prompt';
import { getJnodesMap } from '../api/_github';
import { getPrompts } from 'api/_prompts';
import placeholdersJSON from 'data/placeholders.json';
import { placeholdersJSONSchema } from 'schemas/data';

export type Props = {
  placeholder: string;
  prompts: ClientPrompt[];
  initialJNodes: JNodeShallow[];
};

const placeholders = placeholdersJSONSchema.parse(placeholdersJSON);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
  const jnodesMap = await getJnodesMap();
  const prompts = getClientPrompts(getPrompts(jnodesMap));
  const initialJNodes = Object.values(jnodesMap).map<JNodeShallow>((jnode) => ({
    ...jnode,
    resources: Object.values(jnode.resources).flat().length,
  }));
  return { props: { placeholder, prompts, initialJNodes } };
};

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
