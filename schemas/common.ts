import { Prompt } from 'types/common';
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

export const jnodeSchema: z.ZodType<JNode> = baseJNodeSchema.extend({
  id: z.string(),
  name: z.string(),
  dependencies: z.lazy(() => z.array(jnodeSchema)),
});

export const promptSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  response: z.function().returns(
    z.promise(
      z.object({
        nodes: z.any().array(),
        edges: z.any().array(),
      }),
    ),
  ),
});
