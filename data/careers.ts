import { golang, java, javascript, nodejs, react, rust } from './jnodes';

import { JNode } from 'types/common';

export const frontend: JNode = {
  id: 'frontend',
  name: 'Frontend Developer',
  type: 'career',
  dependencies: [javascript, react],
};

export const backend: JNode = {
  id: 'backend',
  name: 'Backend Developer',
  type: 'career',
  dependencies: [nodejs, golang, rust, java],
};

export const devops: JNode = {
  id: 'career',
  name: 'DevOps Engineer',
  type: 'career',
  dependencies: [],
};
