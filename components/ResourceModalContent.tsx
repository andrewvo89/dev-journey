import { Accordion, Stack, Text, createStyles } from '@mantine/core';
import { NarrowResourceType, Resource, Resources } from 'types/jnode';
import ResourceTable, { FieldMap } from 'components/ResourceTable';

type ResourceMap<TType extends Resource['type']> = {
  id: keyof Resources;
  heading: string;
  emptyDataMessage: string;
  fieldMappings: FieldMap<NarrowResourceType<TType>>[];
  type: TType;
};

const documentation: ResourceMap<'documentation'> = {
  id: 'documentation',
  heading: 'Documentation',
  emptyDataMessage: 'Suggest documentation...',
  fieldMappings: [
    { key: 'name', heading: 'Name' },
    { key: 'author', heading: 'Author' },
  ],
  type: 'documentation',
};

const videos: ResourceMap<'video'> = {
  id: 'videos',
  heading: 'Videos',
  emptyDataMessage: 'Suggest a video...',
  fieldMappings: [
    { key: 'name', heading: 'Name' },
    { key: 'author', heading: 'Author' },
    {
      key: 'duration',
      heading: 'Duration',
      transform: (value) => {
        const hours = parseFloat(String(value));
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      },
    },
  ],
  type: 'video',
};

const courses: ResourceMap<'course'> = {
  id: 'courses',
  heading: 'Courses',
  emptyDataMessage: 'Suggest a course...',
  fieldMappings: [
    { key: 'name', heading: 'Name' },
    { key: 'author', heading: 'Author' },
    {
      key: 'duration',
      heading: 'Duration',
      transform: (value) => {
        const hours = parseFloat(String(value));
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      },
    },
    { key: 'platform', heading: 'Platform' },
  ],
  type: 'course',
};

const articles: ResourceMap<'article'> = {
  id: 'articles',
  heading: 'Articles',
  emptyDataMessage: 'Suggest an article...',
  fieldMappings: [
    { key: 'name', heading: 'Name' },
    { key: 'author', heading: 'Author' },
  ],
  type: 'article',
};

const books: ResourceMap<'book'> = {
  id: 'books',
  heading: 'Books',
  emptyDataMessage: 'Suggest a book...',
  fieldMappings: [
    { key: 'name', heading: 'Name' },
    { key: 'author', heading: 'Author' },
    { key: 'pages', heading: 'Pages' },
  ],
  type: 'book',
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
        {map.heading}
        {`${data.length > 0 ? ` (${data.length})` : ''}`}
      </Accordion.Control>
      <Accordion.Panel>
        {data.length === 0 ? (
          <Text mx={16} my={8}>
            {map.emptyDataMessage}
          </Text>
        ) : (
          <ResourceTable data={data} fieldMappings={map.fieldMappings} />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

type Props = {
  description: string;
  resources: Resources;
};

const fallback =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function ResourceModalContent(props: Props) {
  const { resources, description } = props;
  const { classes } = useStyles();

  return (
    <Stack>
      {description ? description.split('\n').map((line) => <Text key={line}>{line}</Text>) : <Text>{fallback}</Text>}
      <Accordion variant='separated' classNames={{ content: classes.accordianContent }}>
        {[articles, books, courses, documentation, videos].map((map) => (
          <AccordionItem key={map.id} data={resources[map.id]} map={map} />
        ))}
      </Accordion>
    </Stack>
  );
}
