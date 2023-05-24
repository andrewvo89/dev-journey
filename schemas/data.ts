import { jnodeSchema } from 'schemas/common';
import { z } from 'zod';

export const careerJSONSchema = z.record(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export const techJSONSchema = z.record(jnodeSchema);
