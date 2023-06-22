import { jnodeSchema } from 'schemas/jnode';
import { z } from 'zod';

export const jnodeJSONSchema = z.record(jnodeSchema);

export const placeholdersJSONSchema = z.string().array().min(1);
