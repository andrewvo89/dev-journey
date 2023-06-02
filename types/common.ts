import { promptResponseSchema, promptSchema } from 'schemas/common';

import { JNode } from 'types/jnode';
import { z } from 'zod';

export type Prompt = z.infer<typeof promptSchema>;

export type PromptResponse = z.infer<typeof promptResponseSchema>;

export type ClientPrompt = {
  value: string;
  label: string;
};

export type Route = JNode[];

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
