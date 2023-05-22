import { JNode } from 'types/common';

export const root: JNode = {
  id: 'root',
  name: 'Start of journey',
  type: 'technology',
  dependencies: [],
};

export const html: JNode = {
  id: 'html',
  name: 'HTML',
  type: 'technology',
  dependencies: [root],
};

export const css: JNode = {
  id: 'css',
  name: 'CSS',
  type: 'technology',
  dependencies: [html],
};

export const javascript: JNode = {
  id: 'javascript',
  name: 'JavaScript',
  type: 'technology',
  dependencies: [html, css, root],
};

export const typescript: JNode = {
  id: 'typescript',
  name: 'TypeScript',
  type: 'technology',
  dependencies: [javascript],
};

export const golang: JNode = {
  id: 'golang',
  name: 'Golang',
  type: 'technology',
  dependencies: [root],
};

export const rust: JNode = {
  id: 'rust',
  name: 'Rust',
  type: 'technology',
  dependencies: [root],
};

export const java: JNode = {
  id: 'java',
  name: 'Java',
  type: 'technology',
  dependencies: [root],
};

export const react: JNode = {
  id: 'react',
  name: 'React',
  type: 'technology',
  dependencies: [javascript],
};

export const nextjs: JNode = {
  id: 'nextjs',
  name: 'Next.js',
  type: 'technology',
  dependencies: [react],
};

export const remix: JNode = {
  id: 'remix',
  name: 'Remix',
  type: 'technology',
  dependencies: [react],
};

export const astro: JNode = {
  id: 'astro',
  name: 'Astro',
  type: 'technology',
  dependencies: [react],
};

export const vue: JNode = {
  id: 'vue',
  name: 'Vue.js',
  type: 'technology',
  dependencies: [javascript],
};

export const svelte: JNode = {
  id: 'svelte',
  name: 'Svelte',
  type: 'technology',
  dependencies: [javascript],
};

export const nodejs: JNode = {
  id: 'nodejs',
  name: 'Node.js',
  type: 'technology',
  dependencies: [javascript],
};

export const deno: JNode = {
  id: 'deno',
  name: 'Deno',
  type: 'technology',
  dependencies: [nodejs],
};

export const jNodes: JNode[] = [
  root,
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
];
