import {
  articleResourceSchema,
  bookResourceSchema,
  courseResourceSchema,
  jnodeShallowSchema,
  miscResourceSchema,
  videoResourceSchema,
} from 'schemas/jnode';

import { journeySchema } from 'schemas/journey';
import { z } from 'zod';

export const destinationBookmarkSchema = z.object({
  id: z.string(),
  type: z.literal('destination'),
  jnode: jnodeShallowSchema,
});

export const journeyBookmarkSchema = z.object({
  id: z.string(),
  type: z.literal('journey'),
  journey: journeySchema,
});

export const articleBookmark = z.object({
  id: z.string(),
  type: z.literal('article'),
  article: articleResourceSchema,
});

export const bookBookmark = z.object({
  id: z.string(),
  type: z.literal('book'),
  book: bookResourceSchema,
});

export const courseBookmark = z.object({
  id: z.string(),
  type: z.literal('course'),
  course: courseResourceSchema,
});

export const miscBookmark = z.object({
  id: z.string(),
  type: z.literal('misc'),
  misc: miscResourceSchema,
});

export const videoBookmark = z.object({
  id: z.string(),
  type: z.literal('video'),
  video: videoResourceSchema,
});

export const bookmarkSchema = z.discriminatedUnion('type', [
  destinationBookmarkSchema,
  journeyBookmarkSchema,
  articleBookmark,
  bookBookmark,
  courseBookmark,
  miscBookmark,
  videoBookmark,
]);

export const bookmarkTypeSchema = z.union([
  z.literal('destination'),
  z.literal('journey'),
  z.literal('article'),
  z.literal('book'),
  z.literal('course'),
  z.literal('misc'),
  z.literal('video'),
]);

export const bookmarkSortSchema = z.union([z.literal('asc'), z.literal('desc'), z.literal('none')]);
