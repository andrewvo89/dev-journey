import { bookmarkSchema, bookmarkSortSchema, bookmarkTypeSchema } from 'schemas/bookmark';

import { journeySchema } from 'schemas/journey';
import { z } from 'zod';

export const importTypeSchema = z.union([
  z.literal('history'),
  z.literal('bookmarks'),
  z.literal('filters'),
  z.literal('sort'),
]);

export const importFileSchema = z.object({
  history: journeySchema.array().optional(),
  bookmarks: bookmarkSchema.array().optional(),
  filters: bookmarkTypeSchema.array().optional(),
  sort: bookmarkSortSchema.optional(),
});
