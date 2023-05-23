import { JNode } from 'types/common';

export const root: JNode = {
  id: 'root',
  name: 'Start of journey',
  dependencies: [],
};

const html: JNode = {
  id: 'html',
  name: 'HTML',
  dependencies: [root.id],
};

const css: JNode = {
  id: 'css',
  name: 'CSS',
  dependencies: [html.id],
};

const javascript: JNode = {
  id: 'javascript',
  name: 'JavaScript',
  dependencies: [html.id, css.id, root.id],
};

const typescript: JNode = {
  id: 'typescript',
  name: 'TypeScript',
  dependencies: [javascript.id],
};

const golang: JNode = {
  id: 'golang',
  name: 'Golang',
  dependencies: [root.id],
};

const rust: JNode = {
  id: 'rust',
  name: 'Rust',
  dependencies: [root.id],
};

const java: JNode = {
  id: 'java',
  name: 'Java',
  dependencies: [root.id],
};

const react: JNode = {
  id: 'react',
  name: 'React',
  dependencies: [javascript.id],
};

const nextjs: JNode = {
  id: 'nextjs',
  name: 'Next.js',
  dependencies: [react.id],
};

const remix: JNode = {
  id: 'remix',
  name: 'Remix',
  dependencies: [react.id],
};

const astro: JNode = {
  id: 'astro',
  name: 'Astro',
  dependencies: [react.id],
};

const vue: JNode = {
  id: 'vue',
  name: 'Vue.js',
  dependencies: [javascript.id],
};

const svelte: JNode = {
  id: 'svelte',
  name: 'Svelte',
  dependencies: [javascript.id],
};

const nodejs: JNode = {
  id: 'nodejs',
  name: 'Node.js',
  dependencies: [javascript.id],
};

const deno: JNode = {
  id: 'deno',
  name: 'Deno',
  dependencies: [nodejs.id],
};

export const techMap = {
  css,
  html,
  javascript,
  typescript,
  golang,
  rust,
  java,
  react,
  nextjs,
  remix,
  astro,
  vue,
  svelte,
  nodejs,
  deno,
};
