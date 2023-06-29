import { JNode, JnodesMap } from 'types/jnode';

import axios from 'axios';
import { isServer } from 'utils/common';
import { jnodeSchema } from 'schemas/jnode';
import { jnodeTypes } from 'utils/jnode';

const baseUrl = process.env.GITHUB_API_BASE_URL;
const ghToken = process.env.GITHUB_TOKEN;
const baseRawUrl = isServer ? process.env.GITHUB_RAW_BASE_URL : process.env.NEXT_PUBLIC_GITHUB_RAW_BASE_URL;

/**
 * To only be run on the server as it contains a GitHub token.
 * @export
 * @return {*}  {Promise<JnodesMap>}
 */
export async function getJnodesMap(): Promise<JnodesMap> {
  const keys = (await Promise.all(jnodeTypes.map(getJnodeKeys))).flat();
  const jnodes = await Promise.all(keys.map(getJnode));
  return jnodes.reduce((jnodeMap, jnode) => ({ ...jnodeMap, [jnode.id]: jnode }), {});
}

/**
 * To only be run on the server as it contains a GitHub token.
 * @param {string} folder
 * @return {*}  {Promise<string[]>}
 */
async function getJnodeKeys(folder: string): Promise<string[]> {
  const response = await axios.get(`${baseUrl}/${folder}`, { headers: { Authorization: `Bearer ${ghToken}` } });
  return response.data
    .filter((item: any) => item.type === 'file')
    .map((item: any) => `${folder}/${item.name.replace('.json', '')}`);
}

/**
 * Can be run on client side safely as it does not require a GitHub token.
 * @export
 * @param {string} key
 * @return {*}  {Promise<JNode>}
 */
export async function getJnode(key: string): Promise<JNode> {
  const response = await axios.get<JNode>(`${baseRawUrl}/${key}.json`);
  const jnode = jnodeSchema.omit({ id: true, type: true }).parse(response.data);
  const [type, id] = key.split('/');
  return jnodeSchema.parse({ ...jnode, id: `${type}/${id}`, type });
}
