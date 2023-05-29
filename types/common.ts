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

export type DestinationPath = {
  desId: string;
  routes: Route[];
  enabled: boolean;
};

export type OptionalPath = {
  desId: string;
  routes: Route[];
};

export type Journey = {
  id: string;
  createdAt: string;
  prompt: ClientPrompt;
  desPaths: DestinationPath[];
  optPaths: OptionalPath[];
};
