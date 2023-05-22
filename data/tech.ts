import { JNode } from 'types/common';

export const root: JNode = {
  id: 'root',
  name: 'Start of journey',
  dependencies: [],
};

const html: JNode = {
  id: 'html',
  name: 'HTML',
  dependencies: [root],
};

const css: JNode = {
  id: 'css',
  name: 'CSS',
  dependencies: [html],
};

const javascript: JNode = {
  id: 'javascript',
  name: 'JavaScript',
  dependencies: [html, css, root],
};

const typescript: JNode = {
  id: 'typescript',
  name: 'TypeScript',
  dependencies: [javascript],
};

const golang: JNode = {
  id: 'golang',
  name: 'Golang',
  dependencies: [root],
};

const rust: JNode = {
  id: 'rust',
  name: 'Rust',
  dependencies: [root],
};

const java: JNode = {
  id: 'java',
  name: 'Java',
  dependencies: [root],
};

const react: JNode = {
  id: 'react',
  name: 'React',
  dependencies: [javascript],
};

const nextjs: JNode = {
  id: 'nextjs',
  name: 'Next.js',
  dependencies: [react],
};

const remix: JNode = {
  id: 'remix',
  name: 'Remix',
  dependencies: [react],
};

const astro: JNode = {
  id: 'astro',
  name: 'Astro',
  dependencies: [react],
};

const vue: JNode = {
  id: 'vue',
  name: 'Vue.js',
  dependencies: [javascript],
};

const svelte: JNode = {
  id: 'svelte',
  name: 'Svelte',
  dependencies: [javascript],
};

const nodejs: JNode = {
  id: 'nodejs',
  name: 'Node.js',
  dependencies: [javascript],
};

const deno: JNode = {
  id: 'deno',
  name: 'Deno',
  dependencies: [nodejs],
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
