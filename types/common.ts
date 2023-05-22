import { jnodeSchema, promptResponseSchema, promptSchema } from 'schemas/common';

import { z } from 'zod';

export type JNode = z.infer<typeof jnodeSchema>;

export type Prompt = z.infer<typeof promptSchema>;

export type PromptResponse = z.infer<typeof promptResponseSchema>;

export type ClientPrompt = {
  value: string;
  label: string;
};
