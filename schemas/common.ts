import { z } from 'zod';

export const destinationSchema = z.object({
  id: z.string(),
});

export const promptResponseSchema = z.object({
  destinations: z.array(destinationSchema),
});

export const promptSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  priority: z.number(),
  response: z.function().returns(z.promise(promptResponseSchema)),
});
