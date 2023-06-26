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
    for (const key of importFiles) {
      const imports = fs.readFileSync(path.join(__dirname, '..', 'imports', folder, key), 'utf-8');
      const res = await mergeImports(key, imports, prevJSON[key].resources);
      newResources.push(res);
    }

    // const fns = importFiles.map((key) => {
    //   const imports = fs.readFileSync(path.join(__dirname, '..', 'imports', folder, key), 'utf-8');
    //   return mergeImports(key, imports, prevJSON[key].resources);
    // })
    // const newResources = await Promise.all(
    //   importFiles.map((key) => {
    //     const imports = fs.readFileSync(path.join(__dirname, '..', 'imports', folder, key), 'utf-8');
    //     return mergeImports(key, imports, prevJSON[key].resources);
    //   }),
    // );
    const newJSON = newResources.reduce((json, resources, index) => {
      const key = importFiles[index];
      return produce(json, (draft) => {
        draft[key].resources = resources;
      });
    }, prevJSON);
    fs.writeFileSync(path.join(__dirname, '..', 'jnodes', `${folder}.json`), JSON.stringify(newJSON, null, 2));
  }
}

async function mergeImports(key: string, imports: string, resources: Resources): Promise<Resources> {
  const newResources: Resource[] = [];
  const articleUrls = getUrls(imports, 'articles').filter((url) => incompleteFilter(url, resources.articles));
  for (const url of articleUrls) {
    const resource = await scrapeArticle(url);
    newResources.push(resource);
  }
  const bookUrls = getUrls(imports, 'books').filter((url) => incompleteFilter(url, resources.books));
  for (const url of bookUrls) {
    const resource = await scrapeBook(url);
    newResources.push(resource);
  }
  const courseUrls = getUrls(imports, 'courses').filter((url) => incompleteFilter(url, resources.courses));
  for (const url of courseUrls) {
    const resource = await scrapeCourse(url);
    newResources.push(resource);
  }
  const videoUrls = getUrls(imports, 'videos').filter((url) => incompleteFilter(url, resources.videos));
  for (const url of videoUrls) {
    const resource = await scrapeVideo(url);
    newResources.push(resource);
  }
  const documentationUrls = getUrls(imports, 'documentation').filter((url) =>
    incompleteFilter(url, resources.documentation),
  );
  for (const url of documentationUrls) {
    const resource: DocumentationResource = { authors: [], title: '', type: 'documentation', url };
    newResources.push(resource);
  }

  // const newResources = await Promise.all([
  //   ...getUrls(imports, 'articles')
  //     .filter((url) => incompleteFilter(url, resources.articles))
  //     .map(scrapeArticle),
  //   ...getUrls(imports, 'books')
  //     .filter((url) => incompleteFilter(url, resources.books))
  //     .map(scrapeBook),
  //   ...getUrls(imports, 'courses')
  //     .filter((url) => incompleteFilter(url, resources.courses))
  //     .map(scrapeCourse),
  //   ...getUrls(imports, 'videos')
  //     .filter((url) => incompleteFilter(url, resources.videos))
  //     .map(scrapeVideo),
  //   ...getUrls(imports, 'documentation')
  //     .filter((url) => incompleteFilter(url, resources.documentation))
  //     .map((url) => Promise.resolve<DocumentationResource>({ authors: [], title: '', type: 'documentation', url })),
  // ]);

  if (newResources.length > 0) {
    console.info(
      `Imported the following resources for ${key}:`,
      newResources.map((r) => r.url),
    );
  }

  return newResources.reduce<Resources>((prevResources, resource) => {
    switch (resource.type) {
      case 'article': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.articles.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.articles.splice(existsIndex, 1, resource);
          } else {
            draft.articles.push(resource);
          }
        });
      }
      case 'book': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.books.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.books.splice(existsIndex, 1, resource);
          } else {
            draft.books.push(resource);
          }
        });
      }
      case 'course': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.courses.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.courses.splice(existsIndex, 1, resource);
          } else {
            draft.courses.push(resource);
          }
        });
      }
      case 'documentation': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.documentation.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.documentation.splice(existsIndex, 1, resource);
          } else {
            draft.documentation.push(resource);
          }
        });
      }
      case 'video': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.videos.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.videos.splice(existsIndex, 1, resource);
          } else {
            draft.videos.push(resource);
          }
        });
      }
    }
  }, resources);
}

function getUrls(importContents: string, key: string) {
  return importContents
    .split(`/* ${key}`)[1]
    .trim()
    .split(`${key} */`)[0]
    .trim()
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function incompleteFilter(url: string, resources: Resource[]): boolean {
  const existing = resources.find((a) => a.url === url);
  return !existing || isResourcePartial(existing);
}
