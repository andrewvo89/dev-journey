import { z } from 'zod';

export const promptResponseSchema = z.object({
  goalIds: z.array(z.string()),
});

export const jnodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  dependencies: z.array(z.string()),
});

export const promptSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  response: z.function().returns(z.promise(promptResponseSchema)),
});
