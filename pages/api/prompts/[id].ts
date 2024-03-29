import type { NextApiRequest, NextApiResponse } from 'next';

import { PromptResponse } from 'types/journey';
import { getJnodesMap } from 'utils/github';
import { getPrompts } from 'utils/prompt';

type SuccessResponse = PromptResponse;

type FailResponse = {
  error: string;
};

type Response = SuccessResponse | FailResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid Prompt ID' });
    return;
  }

  const jnodesMap = await getJnodesMap();
  const prompts = getPrompts(jnodesMap);
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    res.status(404).json({ error: 'Prompt Not Found' });
    return;
  }

  const { destinations } = await prompt.response();
  res.status(200).json({ destinations });
}
