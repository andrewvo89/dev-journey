import { bookmarkSchema, bookmarkSortSchema, bookmarkTypeSchema } from 'schemas/bookmark';

import { z } from 'zod';

export type Bookmark = z.infer<typeof bookmarkSchema>;

export type BookmarkType = z.infer<typeof bookmarkTypeSchema>;

export type BookmarkFilter = BookmarkType;

export type BookmarkSort = z.infer<typeof bookmarkSortSchema>;
