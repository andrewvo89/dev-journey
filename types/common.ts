import { jnodeSchema, promptResponseSchema, promptSchema } from 'schemas/common';

import { z } from 'zod';

export type JNode = z.infer<typeof jnodeSchema>;

export type Prompt = z.infer<typeof promptSchema>;

export type PromptResponse = z.infer<typeof promptResponseSchema>;

export type ClientPrompt = {
  value: string;
  label: string;
};

export type ClientJNode = Pick<JNode, 'id' | 'name' | 'dependencies'>;

export type Route = ClientJNode[];

export type Path = {
  goalId: string;
  routes: Route[];
  enabled: boolean;
};

export type Journey = {
  id: string;
  createdAt: string;
  prompt: ClientPrompt;
  paths: Path[];
};
