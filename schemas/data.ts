import { jnodeSchema } from 'schemas/common';
import { z } from 'zod';

export const careerJSONSchema = z.record(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export const jnodeJSONSchema = z.record(jnodeSchema);

export const placeholdersJSONSchema = z.string().array().min(1);
