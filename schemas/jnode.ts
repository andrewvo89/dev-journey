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
  type: z.literal('book'),
});

export const courseResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  platform: z.string(),
  authors: z.string().array(),
  type: z.literal('course'),
});

export const miscResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  type: z.literal('misc'),
});

export const videoResourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  authors: z.string().array(),
  duration: z.number(),
  type: z.literal('video'),
});

export const jnodeTypeSchema = z.union([
  z.literal('database'),
  z.literal('field'),
  z.literal('framework'),
  z.literal('language'),
  z.literal('library'),
  z.literal('paradigm'),
  z.literal('platform'),
  z.literal('root'),
  z.literal('runtime'),
  z.literal('tool'),
]);

export const resourceSchema = z.discriminatedUnion('type', [
  articleResourceSchema,
  bookResourceSchema,
  courseResourceSchema,
  miscResourceSchema,
  videoResourceSchema,
]);

export const resourcesSchema = z.object({
  articles: z.array(articleResourceSchema),
  books: z.array(bookResourceSchema),
  courses: z.array(courseResourceSchema),
  misc: z.array(miscResourceSchema),
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

export const jnodeShallowSchema = jnodeSchema.omit({ description: true, resources: true }).extend({
  resources: z.number(),
});

export const jnodesMapSchema = z.record(jnodeSchema);

export const partialResourcesSchema = z.object({
  total: z.number(),
  resources: resourceSchema.array(),
});
