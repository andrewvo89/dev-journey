import { bookmarkSchema, bookmarkTypeSchema } from 'schemas/bookmark';

import { z } from 'zod';

export type Bookmark = z.infer<typeof bookmarkSchema>;

export type BookmarkType = z.infer<typeof bookmarkTypeSchema>;
