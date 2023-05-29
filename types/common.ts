import { jnodeSchema, jnodeTypeSchema, promptResponseSchema, promptSchema } from 'schemas/common';

import { z } from 'zod';

export type JNode = z.infer<typeof jnodeSchema>;

export type JNodeType = z.infer<typeof jnodeTypeSchema>;

export type Prompt = z.infer<typeof promptSchema>;

export type PromptResponse = z.infer<typeof promptResponseSchema>;

export type ClientPrompt = {
  value: string;
  label: string;
};

export type ClientJNode = Omit<JNode, 'attributes'>;

export type Route = ClientJNode[];

export type Destination = {
  id: string;
  enabled: boolean;
};

export type DestinationWithRoutes = Destination & {
  routes: Route[];
};

export type Journey = {
  id: string;
  createdAt: string;
  prompt: ClientPrompt;
  destinations: Destination[];
};
