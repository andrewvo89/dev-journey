import { z } from 'zod';

export const videoResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  author: z.string(),
  duration: z.number(),
  type: z.literal('video'),
});

export const courseResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  platform: z.string(),
  author: z.string(),
  duration: z.number(),
  type: z.literal('course'),
});

export const documentationResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  author: z.string(),
  type: z.literal('documentation'),
});

export const articleResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  author: z.string(),
  type: z.literal('article'),
});

export const bookResourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  author: z.string(),
  pages: z.number(),
  type: z.literal('book'),
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
  description: z.string(),
  type: jnodeTypeSchema,
  dependencies: z.array(z.string()),
  resources: resourcesSchema,
});