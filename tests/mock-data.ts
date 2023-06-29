import { JNodeShallow } from 'types/jnode';
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

export const mockJnodes: JNodeShallow[] = [
  {
    id: 'root',
    title: 'root',
    dependencies: [],
    resources: faker.number.int(),
    type: 'root',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.word(),
    dependencies: ['root'],
    resources: faker.number.int(),
    type: mockJnodeType(),
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.word(),
    dependencies: ['root'],
    resources: faker.number.int(),
    type: mockJnodeType(),
  },
];
