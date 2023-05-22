import type { NextApiRequest, NextApiResponse } from 'next';

import { Edge } from 'reactflow';
import { promptsMap } from 'data/prompts';

type SuccessResponse = {
  edges: Edge[];
};

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

  const prompt = promptsMap[id];
  if (!prompt) {
    res.status(404).json({ error: 'Prompt Not Found' });
    return;
  }

  const { edges } = await prompt.response();
  res.status(200).json({ edges });
}
