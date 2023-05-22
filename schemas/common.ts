import { z } from 'zod';

const baseJNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type JNode = {
  id: string;
  name: string;
  dependencies: JNode[];
};

export const promptResponseSchema = z.object({
  goalIds: z.array(z.string()),
});

export const jnodeSchema: z.ZodType<JNode> = baseJNodeSchema.extend({
  id: z.string(),
  name: z.string(),
  dependencies: z.lazy(() => z.array(jnodeSchema)),
});

export const promptSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  response: z.function().returns(z.promise(promptResponseSchema)),
});
