import {
  articleResourceSchema,
  bookResourceSchema,
  courseResourceSchema,
  jnodeSchema,
  jnodeShallowSchema,
  jnodeTypeSchema,
  jnodesMapSchema,
  miscResourceSchema,
  partialResourcesSchema,
  resourceSchema,
  resourceTypeSchema,
  resourcesSchema,
  videoResourceSchema,
} from 'schemas/jnode';

import { z } from 'zod';

export type Jnode = z.infer<typeof jnodeSchema>;

export type JnodeShallow = z.infer<typeof jnodeShallowSchema>;

export type JnodeType = z.infer<typeof jnodeTypeSchema>;

export type Resources = z.infer<typeof resourcesSchema>;

export type VideoResource = z.infer<typeof videoResourceSchema>;

export type BookResource = z.infer<typeof bookResourceSchema>;

export type CourseResource = z.infer<typeof courseResourceSchema>;

export type MiscResource = z.infer<typeof miscResourceSchema>;

export type ArticleResource = z.infer<typeof articleResourceSchema>;

export type Resource = z.infer<typeof resourceSchema>;

export type ResourceType = z.infer<typeof resourceTypeSchema>;

export type NarrowResourceType<TType extends ResourceType> = TType extends 'book'
  ? BookResource
  : TType extends 'article'
  ? ArticleResource
  : TType extends 'video'
  ? VideoResource
  : TType extends 'misc'
  ? MiscResource
  : TType extends 'course'
  ? CourseResource
  : never;

export type JnodesMap = z.infer<typeof jnodesMapSchema>;

export type PartialResources = z.infer<typeof partialResourcesSchema>;

export type PartialResourcesMap = Record<ResourceType, PartialResources>;
