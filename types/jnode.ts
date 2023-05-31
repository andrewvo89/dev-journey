import {
  articleResourceSchema,
  bookResourceSchema,
  courseResourceSchema,
  documentationResourceSchema,
  jnodeSchema,
  jnodeTypeSchema,
  resourcesSchema,
  videoResourceSchema,
} from 'schemas/jnode';

import { z } from 'zod';

export type JNode = z.infer<typeof jnodeSchema>;

export type JNodeType = z.infer<typeof jnodeTypeSchema>;

export type Resources = z.infer<typeof resourcesSchema>;

export type VideoResource = z.infer<typeof videoResourceSchema>;

export type BookResource = z.infer<typeof bookResourceSchema>;

export type CourseResource = z.infer<typeof courseResourceSchema>;

export type DocumentationResource = z.infer<typeof documentationResourceSchema>;

export type ArticleResource = z.infer<typeof articleResourceSchema>;

export type Resource = VideoResource | ArticleResource | BookResource | DocumentationResource | CourseResource;
