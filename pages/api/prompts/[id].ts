import { Edge, Node } from 'reactflow';
import type { NextApiRequest, NextApiResponse } from 'next';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prompts } from 'data/prompts';

type SuccessResponse = {
  nodes: Node[];
  edges: Edge[];
};

type FailResponse = {
  error: string;
};

type Response = SuccessResponse | FailResponse;

export default function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { id } = req.query;
  const prompt = prompts.find((p) => p.id === id);
  if (!prompt) {
    res.status(404).json({ error: 'Prompt Not Found' });
    return;
  }

  const { nodes, edges } = prompt.response();

  res.status(200).json({ nodes, edges });
}
