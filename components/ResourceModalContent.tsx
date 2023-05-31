import { Accordion, Stack, Text } from '@mantine/core';

import ResourceTable from 'components/ResourceTable';
import { Resources } from 'types/jnode';

type Props = {
  resources: Resources;
};

export default function ResourceModalContent(props: Props) {
  const { resources } = props;
  const documentationCount = resources.documentation.length;
  const videosCount = resources.videos.length;
  const coursesCount = resources.courses.length;
  const articlesCount = resources.articles.length;
  const booksCount = resources.books.length;

  return (
    <Stack>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Text>
      <Accordion>
        <Accordion.Item value={'documentation'}>
          <Accordion.Control>
            Documentation{`${documentationCount > 0 ? ` (${documentationCount})` : ''}`}
          </Accordion.Control>
          <Accordion.Panel>{documentationCount === 0 && <Text>Suggest documentation...</Text>}</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='videos'>
          <Accordion.Control>Videos{`${videosCount > 0 ? ` (${videosCount})` : ''}`}</Accordion.Control>
          <Accordion.Panel>{videosCount === 0 && <Text>Suggest a video...</Text>}</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='courses'>
          <Accordion.Control>Courses{`${coursesCount > 0 ? ` (${coursesCount})` : ''}`}</Accordion.Control>
          <Accordion.Panel>{coursesCount === 0 && <Text>Suggest a course...</Text>}</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='articles'>
          <Accordion.Control>Articles{`${articlesCount > 0 ? ` (${articlesCount})` : ''}`}</Accordion.Control>
          <Accordion.Panel>
            {articlesCount === 0 ? (
              <Text>Suggest an article...</Text>
            ) : (
              <ResourceTable
                data={resources.articles}
                fieldMappings={[
                  { key: 'name', heading: 'Name' },
                  { key: 'author', heading: 'Author' },
                ]}
              />
            )}
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='books'>
          <Accordion.Control>Books{`${booksCount > 0 ? ` (${booksCount})` : ''}`}</Accordion.Control>
          <Accordion.Panel>{booksCount === 0 && <Text>Suggest an book...</Text>}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
