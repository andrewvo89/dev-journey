import { jnodeSchema, jnodeShallowSchema, jnodeTypeSchema, jnodesMapSchema } from 'schemas/jnode';

import { z } from 'zod';

export type Jnode = z.infer<typeof jnodeSchema>;

export type JnodeShallow = z.infer<typeof jnodeShallowSchema>;

export type JnodeType = z.infer<typeof jnodeTypeSchema>;

export type JnodesMap = z.infer<typeof jnodesMapSchema>;
