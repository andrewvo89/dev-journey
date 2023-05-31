import { jnodeSchema, jnodeTypeSchema, resourcesSchema } from 'schemas/jnode';

import { z } from 'zod';

export type JNode = z.infer<typeof jnodeSchema>;

export type JNodeType = z.infer<typeof jnodeTypeSchema>;

export type Resources = z.infer<typeof resourcesSchema>;
