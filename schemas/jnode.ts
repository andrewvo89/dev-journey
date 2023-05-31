import { z } from 'zod';

export const videoResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string(),
  author: z.string(),
  duration: z.number(),
});

export const courseResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string(),
  platform: z.string(),
  author: z.string(),
  duration: z.number(),
});

export const documentationResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string(),
  author: z.string(),
});

export const articleResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  author: z.string(),
});

export const bookResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string(),
  author: z.string(),
  pages: z.number(),
});

export const jnodeTypeSchema = z.union([
  z.literal('root'),
  z.literal('tool'),
  z.literal('language'),
  z.literal('database'),
  z.literal('framework'),
  z.literal('meta_framework'),
  z.literal('software'),
  z.literal('library'),
  z.literal('platform'),
  z.literal('paradigm'),
  z.literal('field'),
  z.literal('career'),
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
  name: z.string(),
  type: jnodeTypeSchema,
  dependencies: z.array(z.string()),
  attributes: z.object({
    group: z.string(),
    careers: z.array(z.string()),
  }),
  resources: resourcesSchema,
});
