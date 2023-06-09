import { JNode } from 'types/jnode';
import { faker } from '@faker-js/faker';

export const mockJnodeType = () =>
  faker.helpers.arrayElement([
    'tool',
    'language',
    'database',
    'framework',
    'meta_framework',
    'runtime',
    'library',
    'platform',
    'paradigm',
    'field',
    'career',
  ] as const);

export const mockJnodes: JNode[] = [
  {
    id: 'root',
    name: 'root',
    dependencies: [],
    description: faker.lorem.paragraph(),
    resources: {
      articles: [],
      books: [],
      courses: [],
      documentation: [],
      videos: [],
    },
    type: 'root',
  },
  {
    id: faker.string.uuid(),
    name: faker.lorem.word(),
    dependencies: ['root'],
    description: faker.lorem.paragraph(),
    resources: {
      articles: [],
      books: [],
      courses: [],
      documentation: [],
      videos: [],
    },
    type: mockJnodeType(),
  },
  {
    id: faker.string.uuid(),
    name: faker.lorem.word(),
    dependencies: ['root'],
    description: 'Start of the tree',
    resources: {
      articles: [],
      books: [],
      courses: [],
      documentation: [],
      videos: [],
    },
    type: mockJnodeType(),
  },
];
