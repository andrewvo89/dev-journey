import { DocumentationResource, JnodesMap, Resource, Resources } from 'types/jnode';
import { scrapeArticle, scrapeBook, scrapeCourse, scrapeVideo } from './scrape';

import { main as backup } from './backup';
import fs from 'fs';
import { isResourcePartial } from './utils';
import { jnodesMapSchema } from '../../schemas/jnode';
import path from 'path';
import { produce } from 'immer';

export async function main() {
  backup();

  const folders = fs
    .readdirSync(path.join(__dirname, '..', 'imports'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'imports', f)).isDirectory());

  for (const folder of folders) {
    const prevJSONStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', `${folder}.json`), 'utf-8');
    const prevJSON: JnodesMap = jnodesMapSchema.parse(JSON.parse(prevJSONStr));

    const importFiles = fs
      .readdirSync(path.join(__dirname, '..', 'imports', folder))
      .filter((f) => fs.statSync(path.join(__dirname, '..', 'imports', folder, f)).isFile());

    const newResources: Resources[] = [];
    const newDescriptions: string[] = [];
    for (const key of importFiles) {
      const importContents = fs.readFileSync(path.join(__dirname, '..', 'imports', folder, key), 'utf-8');
      const { description, resources } = prevJSON[key];
      newResources.push(await mergeImports(key, importContents, resources));
      newDescriptions.push(mergeDescription(key, importContents, description));
    }

    const newJSON = importFiles.reduce(
      (json, key, index) =>
        produce(json, (draft) => {
          draft[key].resources = newResources[index];
          draft[key].description = newDescriptions[index];
        }),
      prevJSON,
    );
    fs.writeFileSync(path.join(__dirname, '..', 'jnodes', `${folder}.json`), JSON.stringify(newJSON, null, 2));
  }
}

function mergeDescription(key: string, importContents: string, prevDesc: string): string {
  if (prevDesc.length > 0) {
    return prevDesc;
  }
  const nextDesc = importContents
    .split('<description>')[1]
    .trim()
    .split('<description/>')[0]
    .trim()
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .join('\n');
  if (nextDesc.length === 0) {
    return prevDesc;
  }
  console.info(`Imported a new description for ${key}`);
  return nextDesc;
}

async function mergeImports(key: string, importContents: string, resources: Resources): Promise<Resources> {
  const scrapedResources: Resource[] = [];
  const articleUrls = getUrls(importContents, 'articles').filter((url) => incompleteFilter(url, resources.articles));
  for (const url of articleUrls) {
    const resource = await scrapeArticle(url);
    scrapedResources.push(resource);
  }
  const bookUrls = getUrls(importContents, 'books').filter((url) => incompleteFilter(url, resources.books));
  for (const url of bookUrls) {
    const resource = await scrapeBook(url);
    scrapedResources.push(resource);
  }
  const courseUrls = getUrls(importContents, 'courses').filter((url) => incompleteFilter(url, resources.courses));
  for (const url of courseUrls) {
    const resource = await scrapeCourse(url);
    scrapedResources.push(resource);
  }
  const videoUrls = getUrls(importContents, 'videos').filter((url) => incompleteFilter(url, resources.videos));
  for (const url of videoUrls) {
    const resource = await scrapeVideo(url);
    scrapedResources.push(resource);
  }
  const documentationUrls = getUrls(importContents, 'documentation').filter((url) =>
    incompleteFilter(url, resources.documentation),
  );
  for (const url of documentationUrls) {
    const resource: DocumentationResource = { title: '', type: 'documentation', url };
    scrapedResources.push(resource);
  }

  const { newResources, newResourcesMap } = scrapedResources.reduce<{
    newResources: Resource[];
    newResourcesMap: Resources;
  }>(
    (prev, resource) => {
      switch (resource.type) {
        case 'article': {
          return produce(prev, (draft) => {
            const existsIndex = draft.newResourcesMap.articles.findIndex((a) => a.url === resource.url);
            if (existsIndex > -1) {
              draft.newResourcesMap.articles.splice(existsIndex, 1, resource);
            } else {
              draft.newResources.push(resource);
              draft.newResourcesMap.articles.push(resource);
            }
          });
        }
        case 'book': {
          return produce(prev, (draft) => {
            const existsIndex = draft.newResourcesMap.books.findIndex((a) => a.url === resource.url);
            if (existsIndex > -1) {
              draft.newResourcesMap.books.splice(existsIndex, 1, resource);
            } else {
              draft.newResources.push(resource);
              draft.newResourcesMap.books.push(resource);
            }
          });
        }
        case 'course': {
          return produce(prev, (draft) => {
            const existsIndex = draft.newResourcesMap.courses.findIndex((a) => a.url === resource.url);
            if (existsIndex > -1) {
              draft.newResourcesMap.courses.splice(existsIndex, 1, resource);
            } else {
              draft.newResources.push(resource);
              draft.newResourcesMap.courses.push(resource);
            }
          });
        }
        case 'documentation': {
          return produce(prev, (draft) => {
            const existsIndex = draft.newResourcesMap.documentation.findIndex((a) => a.url === resource.url);
            if (existsIndex > -1) {
              draft.newResourcesMap.documentation.splice(existsIndex, 1, resource);
            } else {
              draft.newResources.push(resource);
              draft.newResourcesMap.documentation.push(resource);
            }
          });
        }
        case 'video': {
          return produce(prev, (draft) => {
            const existsIndex = draft.newResourcesMap.videos.findIndex((a) => a.url === resource.url);
            if (existsIndex > -1) {
              draft.newResourcesMap.videos.splice(existsIndex, 1, resource);
            } else {
              draft.newResources.push(resource);
              draft.newResourcesMap.videos.push(resource);
            }
          });
        }
      }
    },
    { newResources: [], newResourcesMap: resources },
  );

  if (newResources.length > 0) {
    console.info(
      `Imported the following new resources for ${key}:`,
      newResources.map((r) => r.url),
    );
  }

  return newResourcesMap;
}

function getUrls(importContents: string, key: string): string[] {
  return importContents
    .split(`<${key}>`)[1]
    .trim()
    .split(`<${key}/>`)[0]
    .trim()
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function incompleteFilter(url: string, resources: Resource[]): boolean {
  const existing = resources.find((a) => a.url === url);
  return !existing || isResourcePartial(existing);
}
