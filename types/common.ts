import { jnodeSchema, promptSchema } from 'schemas/common';

import { z } from 'zod';

export type JNode = z.infer<typeof jnodeSchema>;

export type Prompt = z.infer<typeof promptSchema>;

export type ClientPrompt = {
  value: string;
  label: string;
};
