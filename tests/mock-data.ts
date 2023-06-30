import { JnodeShallow, JnodeType } from 'types/jnode';

import { faker } from '@faker-js/faker';
import { jnodeTypes } from 'utils/jnode';

export const mockJnodeType = (): JnodeType => faker.helpers.arrayElement(jnodeTypes);

export const mockJnodes: JnodeShallow[] = [
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
