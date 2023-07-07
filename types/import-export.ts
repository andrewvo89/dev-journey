import { importFileSchema, importTypeSchema } from 'schemas/import-export';

import { z } from 'zod';

export type ImportType = z.infer<typeof importTypeSchema>;

export type ImportFile = z.infer<typeof importFileSchema>;
