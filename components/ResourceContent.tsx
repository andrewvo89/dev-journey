import { Accordion, Anchor, Badge, Group, Skeleton, Stack, Text, createStyles } from '@mantine/core';
import { NarrowResource, ResourceMap, ResourceType } from 'types/resource';
import { issuesUrl, toReadableHours } from 'utils/common';
import { useMemo, useState } from 'react';

import { JnodeShallow } from 'types/jnode';
import ResourceTable from 'components/ResourceTable';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getJnode } from 'utils/github';
import { useQuery } from '@tanstack/react-query';

dayjs.extend(duration);

const misc: ResourceMap<'misc'> = {
  id: 'misc',
  heading: 'Miscellaneous',
  singularTerm: 'miscellaneous',
  pluralTerm: 'miscellaneous',
  fieldMappings: [{ key: 'title', heading: 'Title' }],
  type: 'misc',
  initialSort: 'title',
};

const videos: ResourceMap<'video'> = {
  id: 'videos',
  heading: 'Videos',
  singularTerm: 'video',
  pluralTerm: 'videos',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? (value.length === 0 ? 'N/A' : value.join(', ')) : value.toString()),
    },
    {
      key: 'duration',
      heading: 'Duration',
      transform: (value) => `${toReadableHours(parseFloat(String(value)))}`,
    },
  ],
  type: 'video',
  initialSort: 'title',
};

const courses: ResourceMap<'course'> = {
  id: 'courses',
  heading: 'Courses',
  singularTerm: 'course',
  pluralTerm: 'courses',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? (value.length === 0 ? 'N/A' : value.join(', ')) : value.toString()),
    },
    {
      key: 'duration',
      heading: 'Duration',
      transform: (value) => (value === 0 ? 'N/A' : `${toReadableHours(parseFloat(String(value)))}`),
    },
    { key: 'platform', heading: 'Platform' },
  ],
  type: 'course',
  initialSort: 'title',
};

const articles: ResourceMap<'article'> = {
  id: 'articles',
  heading: 'Articles',
  singularTerm: 'article',
  pluralTerm: 'articles',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? (value.length === 0 ? 'N/A' : value.join(', ')) : value.toString()),
    },
  ],
  type: 'article',
  initialSort: 'title',
};

const books: ResourceMap<'book'> = {
  id: 'books',
  heading: 'Books',
  singularTerm: 'book',
  pluralTerm: 'books',
  fieldMappings: [
    { key: 'title', heading: 'Title' },
    {
      key: 'authors',
      heading: 'Authors',
      transform: (value) => (Array.isArray(value) ? (value.length === 0 ? 'N/A' : value.join(', ')) : value.toString()),
    },
  ],
  type: 'book',
  initialSort: 'title',
};

type AccordionPanelProps<TType extends ResourceType> = {
  map: ResourceMap<TType>;
  data: NarrowResource<TType>[];
  isOpen: boolean;
};

function AccordionItem<T extends ResourceType>(props: AccordionPanelProps<T>) {
  const { data, map, isOpen } = props;
  return (
    <Accordion.Item value={map.id}>
      <Accordion.Control>
        <Group>
          <Text>{map.heading}</Text>
          {data.length > 0 && <Badge variant='outline'>{data.length}</Badge>}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <ResourceTable data={data} map={map} isVisible={isOpen} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}

type Props = {
  jnodeShallow: JnodeShallow;
};

const fallback =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const useContentStyles = createStyles(() => ({
  accordianContent: { padding: 0 },
  anchor: { alignSelf: 'flex-end' },
}));

export default function ResourceContent(props: Props) {
  const { jnodeShallow } = props;
  const { classes } = useContentStyles();
  const [accordianValue, setAccordianValue] = useState<string | null>(null);

  const { data: jnode } = useQuery({ queryKey: [jnodeShallow.id], queryFn: () => getJnode(jnodeShallow.id) });

  const filtered = useMemo(() => {
    if (!jnode) {
      return [];
    }
    return [articles, books, courses, videos, misc].filter((map) => jnode.resources[map.id].length > 0);
  }, [jnode]);

  if (!jnode) {
    return (
      <Stack spacing='2rem'>
        <Stack>
          <Skeleton height='6rem' />
          <Skeleton height='4rem' />
          <Skeleton height='7rem' />
          <Skeleton height='5rem' />
        </Stack>
        <Stack>
          <Skeleton height='3rem' />
          <Skeleton height='3rem' />
          <Skeleton height='3rem' />
          <Skeleton height='3rem' />
          <Skeleton height='3rem' />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing='2rem'>
      <Stack>
        {jnode.description ? (
          jnode.description.split('\n').map((line) => <Text key={line}>{line}</Text>)
        ) : (
          <Text>{fallback}</Text>
        )}
      </Stack>
      {filtered.length > 0 && (
        <Accordion
          variant='separated'
          classNames={{ content: classes.accordianContent }}
          value={accordianValue}
          onChange={setAccordianValue}
        >
          {filtered.map((map) => (
            <AccordionItem key={map.id} isOpen={accordianValue === map.id} data={jnode.resources[map.id]} map={map} />
          ))}
        </Accordion>
      )}
      <Anchor
        className={classes.anchor}
        href={`${issuesUrl}/new?title=${jnode.title}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        Contribute, amend or report a resource
      </Anchor>
    </Stack>
  );
}
