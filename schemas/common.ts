import { z } from 'zod';

export const destinationSchema = z.object({
  id: z.string(),
});

export const promptResponseSchema = z.object({
  destinations: z.array(destinationSchema),
});

export const resourceSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.union([z.literal('video'), z.literal('article'), z.literal('book'), z.literal('course')]),
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

export const jnodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: jnodeTypeSchema,
  dependencies: z.array(z.string()),
  attributes: z.object({
    group: z.string(),
    careers: z.array(z.string()),
  }),
  resources: z.array(resourceSchema),
});

export const promptSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  priority: z.number(),
  response: z.function().returns(z.promise(promptResponseSchema)),
});
