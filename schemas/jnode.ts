import { z } from 'zod';

export const articleResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  authors: z.string().array(),
  type: z.literal('article'),
});

export const bookResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  authors: z.string().array(),
  pages: z.number(),
  type: z.literal('book'),
});

export const courseResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  platform: z.string(),
  authors: z.string().array(),
  duration: z.number(),
  type: z.literal('course'),
});

export const documentationResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  authors: z.string().array(),
  type: z.literal('documentation'),
});

export const videoResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  authors: z.string().array(),
  duration: z.number(),
  type: z.literal('video'),
});

export const jnodeTypeSchema = z.union([
  z.literal('root'),
  z.literal('tool'),
  z.literal('language'),
  z.literal('database'),
  z.literal('framework'),
  z.literal('meta_framework'),
  z.literal('runtime'),
  z.literal('library'),
  z.literal('platform'),
  z.literal('paradigm'),
  z.literal('field'),
  z.literal('career'),
]);

export const resourceSchema = z.discriminatedUnion('type', [
  articleResourceSchema,
  bookResourceSchema,
  courseResourceSchema,
  documentationResourceSchema,
  videoResourceSchema,
]);

export const resourcesSchema = z.object({
  articles: z.array(articleResourceSchema),
  books: z.array(bookResourceSchema),
  courses: z.array(courseResourceSchema),
  documentation: z.array(documentationResourceSchema),
  videos: z.array(videoResourceSchema),
});

export const jnodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: jnodeTypeSchema,
  dependencies: z.array(z.string()),
  resources: resourcesSchema,
});

export const jnodesMapSchema = z.record(jnodeSchema);

export const partialResourcesSchema = z.object({
  total: z.number(),
  resources: resourceSchema.array(),
});

export const resourceTypeSchema = z.union([
  articleResourceSchema.shape.type,
  bookResourceSchema.shape.type,
  courseResourceSchema.shape.type,
  documentationResourceSchema.shape.type,
  videoResourceSchema.shape.type,
]);
