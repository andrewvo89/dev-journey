import { Accordion, Badge, Group, Stack, Text, createStyles } from '@mantine/core';
import { NarrowResourceType, Resource, Resources } from 'types/jnode';
import ResourceTable, { FieldMap } from 'components/ResourceTable';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { toReadableHours } from 'utils/common';
import { useMemo } from 'react';

dayjs.extend(duration);

type ResourceMap<TType extends Resource['type']> = {
  id: keyof Resources;
  heading: string;
  emptyDataMessage: string;
  fieldMappings: FieldMap<NarrowResourceType<TType>>[];
  type: TType;
  initalSort: keyof NarrowResourceType<TType>;
};

const documentation: ResourceMap<'documentation'> = {
  id: 'documentation',
  heading: 'Documentation',
  emptyDataMessage: 'Suggest documentation...',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? value.join(', ') : value.toString()),
    },
  ],
  type: 'documentation',
  initalSort: 'title',
};

const videos: ResourceMap<'video'> = {
  id: 'videos',
  heading: 'Videos',
  emptyDataMessage: 'Suggest a video...',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? value.join(', ') : value.toString()),
    },
    {
      key: 'duration',
      heading: 'Duration',
      transform: (value) => `${toReadableHours(parseFloat(String(value)))}`,
    },
  ],
  type: 'video',
  initalSort: 'title',
};

const courses: ResourceMap<'course'> = {
  id: 'courses',
  heading: 'Courses',
  emptyDataMessage: 'Suggest a course...',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? value.join(', ') : value.toString()),
    },
    {
      key: 'duration',
      heading: 'Duration',
      transform: (value) => `${toReadableHours(parseFloat(String(value)))}`,
    },
    { key: 'platform', heading: 'Platform' },
  ],
  type: 'course',
  initalSort: 'title',
};

const articles: ResourceMap<'article'> = {
  id: 'articles',
  heading: 'Articles',
  emptyDataMessage: 'Suggest an article...',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? value.join(', ') : value.toString()),
    },
  ],
  type: 'article',
  initalSort: 'title',
};

const books: ResourceMap<'book'> = {
  id: 'books',
  heading: 'Books',
  emptyDataMessage: 'Suggest a book...',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? value.join(', ') : value.toString()),
    },
    { key: 'pages', heading: 'Pages' },
  ],
  type: 'book',
  initalSort: 'title',
};

type AccordionPanelProps<TType extends Resource['type']> = {
  map: ResourceMap<TType>;
  data: NarrowResourceType<TType>[];
};

const useStyles = createStyles(() => ({
  accordianContent: { padding: 0 },
}));

function AccordionItem<T extends Resource['type']>(props: AccordionPanelProps<T>) {
  const { data, map } = props;
  return (
    <Accordion.Item value={map.id}>
      <Accordion.Control>
        <Group>
          <Text>{map.heading}</Text>
          {data.length > 0 && <Badge variant='outline'>{data.length}</Badge>}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {data.length === 0 ? (
          <Text mx={16} my={8}>
            {map.emptyDataMessage}
          </Text>
        ) : (
          <ResourceTable data={data} fieldMappings={map.fieldMappings} initialSort={map.initalSort} />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

type Props = {
  description: string;
  resources: Resources;
  resourceCount: number;
};

const fallback =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function ResourceModalContent(props: Props) {
  const { resources, description, resourceCount } = props;
  const { classes } = useStyles();

  const filtered = useMemo(
    () => [articles, books, courses, documentation, videos].filter((map) => resources[map.id].length > 0),
    [resources],
  );

  return (
    <Stack spacing='2rem'>
      <Stack>
        {description ? description.split('\n').map((line) => <Text key={line}>{line}</Text>) : <Text>{fallback}</Text>}
      </Stack>
      {resourceCount > 0 && (
        <Accordion variant='separated' classNames={{ content: classes.accordianContent }}>
          {filtered.map((map) => (
            <AccordionItem key={map.id} data={resources[map.id]} map={map} />
          ))}
        </Accordion>
      )}
    </Stack>
  );
}
