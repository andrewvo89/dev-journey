import {
  articleResourceSchema,
  bookResourceSchema,
  courseResourceSchema,
  miscResourceSchema,
  partialResourcesSchema,
  resourceSchema,
  resourcesSchema,
  videoResourceSchema,
} from 'schemas/jnode';

import { z } from 'zod';

export type Resources = z.infer<typeof resourcesSchema>;

export type VideoResource = z.infer<typeof videoResourceSchema>;

export type BookResource = z.infer<typeof bookResourceSchema>;

export type CourseResource = z.infer<typeof courseResourceSchema>;

export type MiscResource = z.infer<typeof miscResourceSchema>;

export type ArticleResource = z.infer<typeof articleResourceSchema>;

export type Resource = z.infer<typeof resourceSchema>;

export type ResourceType = Resource['type'];

export type NarrowResource<TType extends ResourceType> = TType extends 'book'
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

export type PartialResources = z.infer<typeof partialResourcesSchema>;

export type PartialResourcesMap = Record<ResourceType, PartialResources>;

export type FieldMap<T extends Resource> = {
  key: keyof T;
  heading: string;
  transform?: (value: T[keyof T]) => string;
};

export type ResourceMap<TType extends ResourceType> = {
  id: keyof Resources;
  heading: string;
  singularTerm: string;
  pluralTerm: string;
  fieldMappings: FieldMap<NarrowResource<TType>>[];
  type: TType;
  initialSort: keyof NarrowResource<TType>;
};
