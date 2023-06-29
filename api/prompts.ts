import { ClientPrompt, Prompt, PromptResponse } from 'types/common';
import {
  getJavascriptPrompt,
  getNosqlPrompt,
  getPythonPrompt,
  getRelationalPrompt,
  getTechPrompts,
} from 'utils/prompt';

import { JnodesMap } from 'types/jnode';
import axios from 'axios';
import { promptResponseSchema } from 'schemas/common';

/**
 * Given a jnodes map, return a list of prompts.
 * @export
 * @param {JnodesMap} jnodeMap
 * @return {*}  {Prompt[]}
 */
export function getPrompts(jnodeMap: JnodesMap): Prompt[] {
  return [
    ...getTechPrompts(jnodeMap),
    getJavascriptPrompt(jnodeMap),
    getPythonPrompt(jnodeMap),
    getRelationalPrompt(jnodeMap),
    getNosqlPrompt(jnodeMap),
  ].sort((a, b) => a.priority - b.priority);
}

/**
 * Given a prompt, return a list of destinations.
 * @export
 * @param {ClientPrompt} prompt
 * @return {*}  {Promise<PromptResponse['destinations']>}
 */
export async function getPromptDestinations(prompt: ClientPrompt): Promise<PromptResponse['destinations']> {
  const res = await axios.post<PromptResponse>(`/api/prompts/${prompt.value}`);
  return promptResponseSchema.parse(res.data).destinations;
}
