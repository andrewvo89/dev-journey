import { z } from 'zod';

export const journeySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  prompt: z.object({
    value: z.string(),
    label: z.string(),
  }),
  destinations: z.array(
    z.object({
      id: z.string(),
      enabled: z.boolean(),
    }),
  ),
});
