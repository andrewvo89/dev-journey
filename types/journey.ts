import { promptResponseSchema, promptSchema } from 'schemas/common';

import { JnodeShallow } from 'types/jnode';
import { journeySchema } from 'schemas/journey';
import { z } from 'zod';

export type Prompt = z.infer<typeof promptSchema>;

export type PromptResponse = z.infer<typeof promptResponseSchema>;

export type ClientPrompt = {
  value: string;
  label: string;
};

export type Route = JnodeShallow[];

export type Destination = {
  id: string;
  enabled: boolean;
};

export type DestinationWithRoutes = Destination & {
  routes: Route[];
};

export type Journey = z.infer<typeof journeySchema>;
