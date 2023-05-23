import { JNode } from 'types/common';
import { techMap } from 'data/tech';

export const frontend: JNode = {
  id: 'frontend',
  name: 'Frontend developer',
  dependencies: [techMap.react.id, techMap.vue.id, techMap.svelte.id],
};

export const backend: JNode = {
  id: 'backend',
  name: 'Backend developer',
  dependencies: [techMap.nodejs.id, techMap.java.id, techMap.rust.id, techMap.golang.id],
};

export const devops: JNode = {
  id: 'devops',
  name: 'DevOps engineer',
  dependencies: [techMap.html.id, techMap.css.id],
};

export const database_administrator: JNode = {
  id: 'database_administrator',
  name: 'Database administrator',
  dependencies: [techMap.html.id, techMap.css.id],
};

export const careersMap = {
  frontend,
  backend,
  devops,
  database_administrator,
};
